<script lang="ts">
	import presetsData from '$lib/data/qr-presets.json';
	import type { QRPreset } from '$lib/types';
	import QRCodeCard from '$lib/components/QRCodeCard.svelte';
	import PaletteHeader from '$lib/components/PaletteHeader.svelte';
	import HeadSummary from '$lib/components/HeadSummary.svelte';
	import { buildZip, countJobImages, type QRJob } from '$lib/qrUtils';
	import { browser } from '$app/environment';
	import { SvelteSet } from 'svelte/reactivity';
	import { defaultQrUrls } from '$lib/config';

	const builtinPresets: QRPreset[] = presetsData.presets as QRPreset[];

	interface Row {
		id: string;
		url: string;
		/** Preset ids checked for this row. */
		presets: SvelteSet<string>;
	}

	let nextRowId = 0;
	function makeRow(url = '', presetIds: string[] = []): Row {
		return { id: `row-${nextRowId++}`, url, presets: new SvelteSet(presetIds) };
	}

	let customPresets = $state<QRPreset[]>([]);
	const allPresets = $derived([...builtinPresets, ...customPresets]);

	// Seed with the default URLs, each pre-checked for the first built-in preset.
	let rows = $state<Row[]>(defaultQrUrls.map((url) => makeRow(url, [builtinPresets[0].id])));

	let generating = $state(false);
	let progress = $state('');
	let error = $state('');
	let fileInput: HTMLInputElement | undefined = $state();
	let bulkText = $state('');
	let showBulk = $state(false);

	const jobs = $derived(
		rows
			.filter((r) => r.url.trim().length > 0)
			.map<QRJob>((r) => ({
				url: r.url.trim(),
				presets: allPresets.filter((p) => r.presets.has(p.id)),
			}))
			.filter((j) => j.presets.length > 0)
	);

	const totalImages = $derived(countJobImages(jobs));
	const canDownload = $derived(totalImages > 0 && !generating);

	function toggleCell(row: Row, presetId: string) {
		if (row.presets.has(presetId)) row.presets.delete(presetId);
		else row.presets.add(presetId);
	}

	/** A column is "on" when every non-empty row has it checked. */
	function columnState(presetId: string) {
		const filled = rows.filter((r) => r.url.trim().length > 0);
		if (filled.length === 0) return { checked: false, indeterminate: false };
		const on = filled.filter((r) => r.presets.has(presetId)).length;
		return { checked: on === filled.length, indeterminate: on > 0 && on < filled.length };
	}

	function toggleColumn(presetId: string) {
		const turnOn = !columnState(presetId).checked;
		for (const row of rows) {
			if (turnOn) row.presets.add(presetId);
			else row.presets.delete(presetId);
		}
	}

	function addRow() {
		// New rows inherit the last row's selection — usually what you want.
		const last = rows[rows.length - 1];
		rows = [...rows, makeRow('', last ? [...last.presets] : [])];
	}

	function removeRow(id: string) {
		rows = rows.filter((r) => r.id !== id);
		if (rows.length === 0) rows = [makeRow()];
	}

	function duplicateRow(row: Row) {
		const copy = makeRow(row.url, [...row.presets]);
		const at = rows.findIndex((r) => r.id === row.id);
		rows = [...rows.slice(0, at + 1), copy, ...rows.slice(at + 1)];
	}

	function applyBulk() {
		const urls = bulkText
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);
		if (urls.length === 0) return;
		const defaults = rows[rows.length - 1]?.presets;
		const added = urls.map((url) => makeRow(url, defaults ? [...defaults] : []));
		// Drop a lone blank row so pasting doesn't leave a gap.
		const base = rows.length === 1 && !rows[0].url.trim() ? [] : rows;
		rows = [...base, ...added];
		bulkText = '';
		showBulk = false;
	}

	async function downloadZip() {
		if (!browser || !canDownload) return;
		generating = true;
		error = '';
		progress = `Generating 0 / ${totalImages}…`;
		try {
			const [blob, { saveAs }] = await Promise.all([
				buildZip(jobs, (done, total) => {
					progress = `Generating ${done} / ${total}…`;
				}),
				import('file-saver'),
			]);
			saveAs(blob, 'qr-codes.zip');
			progress = '';
		} catch (e) {
			error = `Error: ${e instanceof Error ? e.message : String(e)}`;
			progress = '';
		} finally {
			generating = false;
		}
	}

	function handleImport(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target?.result as string);
				const id = `custom-${Date.now()}`;
				const preset: QRPreset = json.id
					? json
					: {
							id,
							name: file.name.replace(/\.json$/i, ''),
							props: json.props ?? {},
							style: json.style ?? {},
							frame: null,
						};
				customPresets = [...customPresets, preset];
			} catch {
				alert('Could not parse preset file — make sure it is a valid JSON config.');
			}
		};
		reader.readAsText(file);
		(event.target as HTMLInputElement).value = '';
	}

	function removeCustomPreset(id: string) {
		customPresets = customPresets.filter((p) => p.id !== id);
		for (const row of rows) row.presets.delete(id);
	}
</script>

<svelte:head>
	<HeadSummary
		title="QR Code Generator — BRDSA"
		description="Batch-generate QR codes in BRDSA style presets"
	/>
</svelte:head>

<article>
	<PaletteHeader>QR Code Generator</PaletteHeader>

	<div class="palette-sibling flex grow justify-center">
		<div class="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
			<p class="text-sm text-dsa-black2 dark:text-white">
				Add a row per QR code, then tick the styles you want for that row. Each row becomes a folder
				in the ZIP.
			</p>

			<!-- Preset reference strip -->
			<section>
				<div class="mb-2 flex flex-wrap items-center gap-3">
					<h2 class="text-lg font-bold dark:text-white">Styles</h2>
					<button
						onclick={() => fileInput?.click()}
						class="rounded-md border border-dsa-black3 bg-white px-2.5 py-1 text-xs font-medium
						       hover:bg-dsa-red4 dark:border-dsa-black2 dark:bg-dsa-black1 dark:text-white
						       dark:hover:bg-dsa-black2"
					>
						+ Import custom style
					</button>
					<input
						bind:this={fileInput}
						type="file"
						accept=".json"
						class="hidden"
						onchange={handleImport}
					/>
				</div>

				<div class="flex flex-wrap gap-3">
					{#each allPresets as preset (preset.id)}
						<QRCodeCard
							{preset}
							onRemove={customPresets.some((p) => p.id === preset.id)
								? () => removeCustomPreset(preset.id)
								: undefined}
						/>
					{/each}
				</div>

				<p class="mt-2 text-xs text-dsa-black2 dark:text-white">
					Import a config exported from this tool or from
					<a
						href="https://mini-qr-code-generator.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						class="underline hover:text-dsa-red dark:text-white">mini-qr</a
					>.
				</p>
			</section>

			<!-- The table -->
			<section>
				<h2 class="mb-2 text-lg font-bold dark:text-white">Codes</h2>

				<div class="overflow-x-auto rounded-md border border-dsa-black3 dark:border-dsa-black2">
					<table class="w-full min-w-128 border-collapse text-sm">
						<thead>
							<tr class="bg-dsa-red4/40 dark:bg-dsa-black1">
								<th class="w-7 px-1.5 py-1.5"></th>
								<th class="px-1.5 py-1.5 text-left font-bold dark:text-white">URL</th>
								{#each allPresets as preset (preset.id)}
									{@const col = columnState(preset.id)}
									<th class="w-24 px-1.5 py-1.5 text-center align-bottom">
										<label
											class="flex cursor-pointer flex-col items-center gap-0.5 text-[11px] font-semibold
											       text-dsa-black dark:text-white"
											title="Toggle {preset.name} for every row"
										>
											<span class="leading-tight">{preset.name}</span>
											<input
												type="checkbox"
												class="size-4 accent-dsa-red"
												checked={col.checked}
												indeterminate={col.indeterminate}
												onchange={() => toggleColumn(preset.id)}
											/>
										</label>
									</th>
								{/each}
								<th class="w-16 px-1.5 py-1.5"></th>
							</tr>
						</thead>
						<tbody>
							{#each rows as row, i (row.id)}
								<tr
									class="border-t border-dsa-black3 dark:border-dsa-black2 {i % 2
										? 'bg-white dark:bg-dsa-black'
										: 'bg-dsa-red4/10 dark:bg-dsa-black1/30'}"
								>
									<td
										class="px-1.5 py-1 text-center text-xs font-medium text-dsa-black
										       dark:text-white"
									>
										{i + 1}
									</td>
									<td class="px-1.5 py-1">
										<input
											type="url"
											bind:value={row.url}
											placeholder="https://example.org"
											aria-label="URL for row {i + 1}"
											class="w-full rounded border border-dsa-black3 bg-white px-2 py-1 font-mono text-xs
											       focus:border-dsa-red focus:outline-none dark:border-dsa-black2
											       dark:bg-dsa-black dark:text-white dark:placeholder-dsa-black3"
										/>
									</td>
									{#each allPresets as preset (preset.id)}
										<td class="px-1.5 py-1 text-center">
											<input
												type="checkbox"
												class="size-4 accent-dsa-red"
												checked={row.presets.has(preset.id)}
												onchange={() => toggleCell(row, preset.id)}
												aria-label="{preset.name} for row {i + 1}"
											/>
										</td>
									{/each}
									<td class="whitespace-nowrap px-1.5 py-1 text-center">
										<button
											onclick={() => duplicateRow(row)}
											title="Duplicate row"
											aria-label="Duplicate row {i + 1}"
											class="px-1 text-xs text-dsa-black2 hover:text-dsa-red dark:text-dsa-black3
											       dark:hover:text-dsa-red1">⧉</button
										>
										<button
											onclick={() => removeRow(row.id)}
											title="Remove row"
											aria-label="Remove row {i + 1}"
											class="px-1 text-sm text-dsa-black2 hover:text-dsa-red dark:text-dsa-black3
											       dark:hover:text-dsa-red1">✕</button
										>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="mt-2 flex flex-wrap gap-2">
					<button
						onclick={addRow}
						class="rounded-md border border-dsa-black3 bg-white px-3 py-1.5 text-sm font-medium
						       hover:bg-dsa-red4 dark:border-dsa-black2 dark:bg-dsa-black1 dark:text-white
						       dark:hover:bg-dsa-black2"
					>
						+ Add row
					</button>
					<button
						onclick={() => (showBulk = !showBulk)}
						class="rounded-md border border-dsa-black3 bg-white px-3 py-1.5 text-sm font-medium
						       hover:bg-dsa-red4 dark:border-dsa-black2 dark:bg-dsa-black1 dark:text-white
						       dark:hover:bg-dsa-black2"
					>
						{showBulk ? 'Cancel paste' : 'Paste URLs'}
					</button>
				</div>

				{#if showBulk}
					<div class="mt-2 space-y-2">
						<textarea
							bind:value={bulkText}
							placeholder="One URL per line"
							rows="4"
							aria-label="Paste URLs, one per line"
							class="w-full rounded-md border border-dsa-black3 bg-white px-3 py-2 font-mono text-sm
							       focus:border-dsa-red focus:outline-none dark:border-dsa-black2 dark:bg-dsa-black
							       dark:text-white dark:placeholder-dsa-black3"
						></textarea>
						<button
							onclick={applyBulk}
							disabled={bulkText.trim().length === 0}
							class="rounded-md bg-dsa-red px-3 py-1.5 text-sm font-bold text-white
							       hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
						>
							Add as rows
						</button>
					</div>
				{/if}
			</section>

			<!-- Action bar -->
			<section class="flex flex-col gap-2">
				<button
					onclick={downloadZip}
					disabled={!canDownload}
					class="w-full rounded-md bg-dsa-red px-4 py-3 text-base font-bold text-white
					       transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40
					       sm:w-auto sm:self-start"
				>
					{generating ? progress : 'Download all as ZIP'}
				</button>

				{#if error}
					<p class="text-sm font-medium text-dsa-red dark:text-dsa-red1">{error}</p>
				{:else if !generating && totalImages > 0}
					<p class="text-sm text-dsa-black2 dark:text-white">
						Will generate {totalImages} image{totalImages === 1 ? '' : 's'} across {jobs.length}
						folder{jobs.length === 1 ? '' : 's'}.
					</p>
				{:else if !generating}
					<p class="text-sm text-dsa-black2 dark:text-white">
						Add a URL and tick at least one style for it.
					</p>
				{/if}
			</section>
		</div>
	</div>
</article>
