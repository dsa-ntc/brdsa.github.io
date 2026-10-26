/**
 * Footnote support for mdsvex.
 *
 * mdsvex 0.12 vendors a pre-remark-13 parser (the legacy `blockTokenizers` /
 * `inlineTokenizers` API). `remark-gfm` targets the modern micromark API, so
 * while its table and strikethrough support happens to work, its *footnote*
 * extension silently no-ops - `[^1]` renders as literal text. mdsvex exposes
 * no option to enable its own vendored footnote tokenizer either.
 *
 * Verified still true on mdsvex 0.12.8 (2026-08): `remark-gfm` alone leaves
 * `[^1]` as literal text, and the legacy tokenizers are still vendored.
 *
 *
 * ## Why not just use an upstream plugin?
 *
 * This is a long-standing known issue upstream, not something specific to us:
 *
 *   - https://github.com/pngwn/MDsveX/issues/374  (2021, closed w/ workaround)
 *   - https://github.com/pngwn/MDsveX/issues/511  (2023, still open)
 *   - https://github.com/pngwn/MDsveX/discussions/236  (maintainer's summary:
 *     "Current versions of some remark plugins do not work with mdsvex")
 *
 * The sanctioned workaround is to pin `remark-footnotes@2.0.0`, the last
 * pre-micromark release. That genuinely does work here; it was tested against
 * mdsvex 0.12.6 and composes with `remark-gfm` in any plugin order. We are not
 * using it for two reasons:
 *
 *   1. It renders the raw label instead of a number, so `[^basile]` shows a
 *      superscript reading "basile", and out-of-order refs render "b" then "a".
 *      Our posts were converted from hand-numbered `1..11` reference lists and
 *      need real sequential numbering. This plugin numbers by order of first
 *      reference, so writers can use meaningful labels like `[^basile]` and
 *      still get "1".
 *   2. `remark-footnotes` is deprecated upstream, so the workaround depends on
 *      an abandoned package.
 *
 * Note that mdsvex's vendored parser already handles tables and strikethrough
 * on its own; `remark-gfm` is not what provides those.
 *
 * ## When this can be deleted
 *
 * The maintainer is writing a from-scratch replacement parser in
 * `packages/parse` (PRs #795, #798, #807). It is not on npm yet and has no
 * footnote support today. Once mdsvex ships a modern parser, drop this file and
 * use `remark-gfm`'s own footnote support.
 *
 *
 * ## How it works
 *
 * We reconstruct footnotes from what the legacy parser *does* emit:
 *
 *   - `[^a]` in prose parses as a `linkReference` with identifier `^a`.
 *   - `[^a]: text` parses as a paragraph starting with that same
 *     `linkReference`, followed by a `": "` text node and the inline content.
 *     Consecutive definition lines share one paragraph, separated by newlines
 *     inside the text nodes.
 *   - `[^b]: plain text` alone can instead collapse into a link `definition`
 *     node whose `url` holds the body.
 *
 * We collect the definitions, number them by order of *first reference* (so
 * writers never hand-number anything), replace references with linked
 * superscripts, and append a single footnotes section.
 *
 * Output markup mirrors GitHub's so it stays familiar and styles predictably.
 */

const FOOTNOTE_ID = /^\^(.+)$/;
const ENDS_WITH_NEWLINE = /\n$/;
const DEFINITION_COLON = /^:\s/;

/** `[^a]` -> "a", otherwise null. */
function footnoteId(node) {
	if (!node || node.type !== "linkReference") return null;
	const match = FOOTNOTE_ID.exec(node.identifier ?? "");
	return match ? match[1] : null;
}

/**
 * Two adjacent markers - `[^1][^2]` or `[^1] [^2]` - are read by the legacy
 * parser as a single *full* reference: label `^2`, link text `^1`. Detect that
 * shape and recover the pair, so writers can stack citations naturally.
 * Returns [firstId, secondId] or null.
 */
function splitAdjacentPair(node) {
	if (!node || node.type !== "linkReference" || node.referenceType !== "full") return null;
	const second = FOOTNOTE_ID.exec(node.identifier ?? "");
	if (!second) return null;
	if (node.children?.length !== 1 || node.children[0].type !== "text") return null;
	const first = FOOTNOTE_ID.exec(node.children[0].value ?? "");
	if (!first) return null;
	return [first[1], second[1]];
}

/** Rebuild a `[^id]` reference node, for when it turns out not to be a definition. */
function referenceNode(id) {
	return {
		type: "linkReference",
		identifier: `^${id}`,
		label: `^${id}`,
		referenceType: "shortcut",
		children: [{ type: "text", value: `^${id}` }]
	};
}

/**
 * Extract every footnote definition contained in a paragraph.
 *
 * Returns { definitions, leading }. `leading` is any content that was not part
 * of a definition; if it is non-empty the paragraph is ordinary prose that
 * merely happens to contain a reference, and the caller keeps it.
 */
function extractDefinitions(node) {
	const definitions = new Map();
	if (!node || node.type !== "paragraph" || !node.children?.length) {
		return { definitions, leading: node ? [node] : [] };
	}

	const leading = [];
	let current = null;
	let atLineStart = true;

	const flush = () => {
		if (!current) return;
		// Drop the trailing newline that separated this definition from the next.
		const last = current.children[current.children.length - 1];
		if (last?.type === "text") {
			const value = last.value.replace(ENDS_WITH_NEWLINE, "");
			if (value) current.children[current.children.length - 1] = { ...last, value };
			else current.children.pop();
		}
		if (current.children.length) definitions.set(current.id, current.children);
		current = null;
	};

	for (const child of node.children) {
		const id = atLineStart ? footnoteId(child) : null;
		if (id !== null) {
			flush();
			current = { id, children: [], pending: true };
			atLineStart = false;
			continue;
		}

		// The node right after a marker must start with ": " for this to be a
		// definition rather than a paragraph that opens with a reference.
		if (current?.pending) {
			if (child.type !== "text" || !DEFINITION_COLON.test(child.value)) {
				leading.push(referenceNode(current.id), child);
				current = null;
				atLineStart = child.type === "text" && ENDS_WITH_NEWLINE.test(child.value);
				continue;
			}
			current.pending = false;
			const value = child.value.replace(/^:\s+/, "");
			if (value) current.children.push({ ...child, value });
			atLineStart = ENDS_WITH_NEWLINE.test(child.value);
			continue;
		}

		(current ? current.children : leading).push(child);
		atLineStart = child.type === "text" && ENDS_WITH_NEWLINE.test(child.value);
	}
	flush();

	return { definitions, leading };
}

/**
 * `[^b]: plain text` on its own can collapse into a link definition node, with
 * the body ending up in `url`. Definitions for real link references (no `^`
 * prefix) are left alone.
 */
function asDefinitionNode(node) {
	if (!node || node.type !== "definition") return null;
	const match = FOOTNOTE_ID.exec(node.identifier ?? "");
	if (!match) return null;
	const value = [node.url, node.title].filter(Boolean).join(" ");
	return { id: match[1], children: [{ type: "text", value }] };
}

function superscript(number, id) {
	return {
		type: "html",
		value:
			`<sup class="footnote-ref" id="fnref-${id}">` +
			`<a href="#fn-${id}" aria-label="Footnote ${number}">${number}</a>` +
			`</sup>`
	};
}

export default function remarkFootnotes() {
	return (tree) => {
		/** @type {Map<string, object[]>} definition id -> inline content */
		const definitions = new Map();

		// Pass 1: pull definitions out of the tree.
		tree.children = tree.children.filter((node) => {
			const single = asDefinitionNode(node);
			if (single) {
				definitions.set(single.id, single.children);
				return false;
			}
			if (node.type !== "paragraph") return true;

			const { definitions: found, leading } = extractDefinitions(node);
			if (found.size === 0) return true;
			for (const [id, children] of found) definitions.set(id, children);

			// Ordinary prose that merely contained a reference - keep it.
			if (leading.length) {
				node.children = leading;
				return true;
			}
			return false;
		});

		if (definitions.size === 0) return;

		// Pass 2: replace references, numbering by order of first appearance.
		const order = [];
		const numbers = new Map();

		const number = (id) => {
			if (!numbers.has(id)) {
				numbers.set(id, order.length + 1);
				order.push(id);
			}
			return superscript(numbers.get(id), id);
		};

		const walk = (node) => {
			if (!node.children?.length) return;
			node.children = node.children.flatMap((child) => {
				// `[^1][^2]` arrives as one node holding both ids.
				const pair = splitAdjacentPair(child);
				if (pair && pair.every((id) => definitions.has(id))) {
					return pair.map(number);
				}

				const id = footnoteId(child);
				// Only treat it as a footnote if we actually have a definition;
				// otherwise it is a genuine link reference and must survive.
				if (id === null || !definitions.has(id)) {
					walk(child);
					return [child];
				}
				return [number(id)];
			});
		};
		walk(tree);

		if (order.length === 0) return;

		// Pass 3: append the rendered footnote list.
		tree.children.push({ type: "html", value: '<hr class="footnotes-sep" />' });
		tree.children.push({
			type: "html",
			value: '<section class="footnotes"><h2 class="sr-only">Footnotes</h2><ol>'
		});

		for (const id of order) {
			tree.children.push({ type: "html", value: `<li id="fn-${id}">` });
			// Emit the body as real mdast so links inside footnotes still flow
			// through the rest of the pipeline (rehype-external-links included).
			tree.children.push({ type: "paragraph", children: definitions.get(id) });
			tree.children.push({
				type: "html",
				value: ` <a href="#fnref-${id}" class="footnote-backref" aria-label="Back to content">&#8617;</a></li>`
			});
		}

		tree.children.push({ type: "html", value: "</ol></section>" });
	};
}
