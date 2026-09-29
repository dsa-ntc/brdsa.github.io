import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "./plugins/remark-footnotes.js";

// Our own canonical host. Links pointing here are treated as internal (no
// new tab), everything else gets the external-link treatment below.
// Keep in sync with `location` in src/lib/config.ts.
const SITE_HOST = "brdsa.org";

// rehype-external-links applies to every <a> with a protocol, so a writer who
// pastes a full https://brdsa.org/... URL would otherwise get a new tab
// pointing back at our own site.
function isExternal(element) {
	const href = element.properties?.href;
	if (typeof href !== "string") return false;
	try {
		const { hostname } = new URL(href);
		return hostname !== SITE_HOST && hostname !== `www.${SITE_HOST}`;
	} catch {
		// Not an absolute URL (mailto:, relative, etc.) - leave it alone.
		return false;
	}
}
/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: [".svx", ".md"],
	// remarkGfm gives writers tables and strikethrough. Its *footnote* support
	// does not work under mdsvex's vendored legacy parser, so remarkFootnotes
	// supplies `[^1]` citations instead - see plugins/remark-footnotes.js.
	remarkPlugins: [remarkGfm, remarkFootnotes],
	rehypePlugins: [
		[rehypeSlug],
		[rehypeAutolinkHeadings, { behavior: "wrap" }],
		[rehypeExternalLinks, { target: ["_blank"], rel: ["noopener", "noreferrer"], test: isExternal }]
	]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			pages: "build",
			assets: "build",
			fallback: undefined,
			precompress: false,
			// setting strict to false so that it doesn't complain about our /api routes
			strict: false
		}),
		paths: {
			base: "",
			assets: ""
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				throw new Error(message);
			},
			handleMissingId: ({ message, id, path }) => {
				console.log(`skipping missing id error ${message}`);
				return;
			}
		}
	},
	extensions: [".svelte", ".svx", ".md"]
};

export default config;
