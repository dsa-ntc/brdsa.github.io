<script lang="ts">
	import presetsData from '$lib/data/qr-presets.json';
	import type { QRPreset } from '$lib/types';
	import QRCodeCard from '$lib/components/QRCodeCard.svelte';
	import PaletteHeader from '$lib/components/PaletteHeader.svelte';
	import HeadSummary from '$lib/components/HeadSummary.svelte';
	import { buildZip } from '$lib/qrUtils';
	import { browser } from '$app/environment';

	const builtinPresets: QRPreset[] = presetsData.presets as QRPreset[];

	let urlText = $state(
		'https://platform.dsausa.org/\nhttps://www.brdsa.org/donate/\nhttps://go.dsausa.org/batonrouge/\nhttps://www.venmo.com/u/BRDSA/'
	);
	let selected = $state(new Set<string>());
	let customPresets = $state<QRPreset[]>([]);
	let generating = $state(false);
	let progress = $state('');
	let fileInput: HTMLInputElement | undefined = $state();

	const urlList = $derived(
		urlText
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean)
	);

	const allPresets = $derived([...builtinPresets, ...customPresets]);

	const activePresets = $derived(allPresets.filter((p) => selected.has(p.id)));

	const canDownload = $derived(urlList.length > 0 && activePresets.length > 0 && !generating);

	function togglePreset(id: string) {
		const next = new Set(selected);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selected = next;
	}

	async function downloadZip() {
		if (!browser || !canDownload) return;
		generating = true;
		progress = `Generating ${urlList.length * activePresets.length} codes…`;
		try {
			const [blob, { saveAs }] = await Promise.all([
				buildZip(urlList, activePresets),
				import('file-saver'),
			]);
			saveAs(blob, 'qr-codes.zip');
			progress = '';
		} catch (e) {
			progress = `Error: ${e instanceof Error ? e.message : String(e)}`;
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
				selected = new Set([...selected, preset.id]);
			} catch {
				alert('Could not parse preset file — make sure it is a valid JSON config.');
			}
		};
		reader.readAsText(file);
		(event.target as HTMLInputElement).value = '';
	}

	function removeCustomPreset(id: string) {
		customPresets = customPresets.filter((p) => p.id !== id);
		const next = new Set(selected);
		next.delete(id);
		selected = next;
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
		<div class="mx-auto w-full max-w-4xl space-y-8 p-4 sm:p-6">

			<!-- Preset cards -->
			<section>
				<h2 class="mb-3 text-lg font-bold dark:text-white">Style presets</h2>
				<div class="flex flex-wrap gap-4">
					{#each allPresets as preset (preset.id)}
						<QRCodeCard
							{preset}
							checked={selected.has(preset.id)}
							onToggle={() => togglePreset(preset.id)}
							onRemove={customPresets.some((p) => p.id === preset.id)
								? () => removeCustomPreset(preset.id)
								: undefined}
						/>
					{/each}
				</div>

				<div class="mt-3">
					<button
						onclick={() => fileInput?.click()}
						class="rounded-md border border-dsa-black3 bg-white px-3 py-1.5 text-sm font-medium
						       hover:bg-dsa-red4 dark:border-dsa-black2 dark:bg-dsa-black1 dark:text-white
						       dark:hover:bg-dsa-black2"
					>
						+ Import custom preset
					</button>
					<input
						bind:this={fileInput}
						type="file"
						accept=".json"
						class="hidden"
						onchange={handleImport}
					/>
					<p class="mt-1 text-xs text-dsa-black2 dark:text-white">
						Import a config exported from this tool or from
						<a
							href="https://mini-qr-code-generator.vercel.app/"
							target="_blank"
							rel="noopener noreferrer"
							class="underline hover:text-dsa-red dark:text-white"
						>mini-qr</a
						>.
					</p>
				</div>
			</section>

			<!-- URL input -->
			<section>
				<label class="mb-1 block text-lg font-bold dark:text-white" for="url-input">
					URLs
					{#if urlList.length > 0}
						<span class="ml-2 rounded-full bg-dsa-red px-2 py-0.5 text-sm font-normal text-white">
							{urlList.length}
						</span>
					{/if}
				</label>
				<textarea
					id="url-input"
					bind:value={urlText}
					placeholder="One URL per line"
					rows="6"
					class="w-full rounded-md border border-dsa-black3 bg-white px-3 py-2 font-mono text-sm
					       focus:border-dsa-red focus:outline-none dark:border-dsa-black2 dark:bg-dsa-black
					       dark:text-white dark:placeholder-dsa-black3"
				></textarea>
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

				{#if !generating && urlList.length > 0 && activePresets.length > 0}
					<p class="text-sm text-dsa-black2 dark:text-white">
						Will generate {urlList.length * activePresets.length} image{urlList.length *
							activePresets.length === 1
							? ''
							: 's'} — one folder per URL, one file per preset.
					</p>
				{/if}

				{#if !generating && (urlList.length === 0 || activePresets.length === 0)}
					<p class="text-sm text-dsa-black2 dark:text-white">
						{urlList.length === 0 ? 'Enter at least one URL.' : 'Select at least one preset.'}
					</p>
				{/if}
			</section>

		</div>
	</div>
</article>
