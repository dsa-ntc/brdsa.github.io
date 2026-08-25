<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { QRPreset } from '$lib/types';
	import { renderQRPreview, exportPresetJson } from '$lib/qrUtils';

	interface Props {
		preset: QRPreset;
		onRemove?: () => void;
	}
	const { preset, onRemove }: Props = $props();

	const PREVIEW_URL = 'https://brdsa.org';
	const PREVIEW_SIZE = 104;

	const mountQR: Attachment = (element) => {
		renderQRPreview(PREVIEW_URL, preset, element as HTMLElement, PREVIEW_SIZE);
		return () => {
			(element as HTMLElement).innerHTML = '';
		};
	};

	let exporting = $state(false);

	async function handleExport() {
		exporting = true;
		try {
			await exportPresetJson(preset);
		} finally {
			exporting = false;
		}
	}
</script>

<div
	class="flex w-[132px] flex-col items-center gap-1.5 rounded-lg border border-dsa-black3 bg-white
	       p-2 dark:border-dsa-black2 dark:bg-dsa-black"
>
	<div
		style="width:{PREVIEW_SIZE}px; height:{PREVIEW_SIZE}px; border-radius:{preset.style
			.borderRadius ?? '8px'}; background:{preset.style.background ?? '#ffffff'}; overflow:hidden;"
		{@attach mountQR}
	></div>

	<p class="text-center text-xs font-semibold dark:text-white">{preset.name}</p>

	<button
		onclick={handleExport}
		disabled={exporting}
		class="w-full rounded border border-dsa-black3 bg-white px-1.5 py-0.5 text-[11px] font-medium
		       hover:bg-dsa-red4 disabled:opacity-50 dark:border-dsa-black2 dark:bg-dsa-black1
		       dark:text-white dark:hover:bg-dsa-black2"
	>
		{exporting ? 'Exporting…' : '↓ Config'}
	</button>

	{#if onRemove}
		<button
			onclick={onRemove}
			class="text-[11px] text-dsa-black2 underline hover:text-dsa-red dark:text-dsa-black3 dark:hover:text-dsa-red1"
		>
			Remove
		</button>
	{/if}
</div>
