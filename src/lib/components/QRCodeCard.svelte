<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { QRPreset } from '$lib/types';
	import { renderQRPreview, exportPresetJson } from '$lib/qrUtils';

	interface Props {
		preset: QRPreset;
		checked: boolean;
		onToggle: () => void;
		onRemove?: () => void;
	}
	const { preset, checked, onToggle, onRemove }: Props = $props();

	const PREVIEW_URL = 'https://brdsa.org';
	const PREVIEW_SIZE = 150;

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
	class="flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors
	       {checked
		? 'border-dsa-red bg-dsa-red4/40 dark:border-dsa-red1 dark:bg-dsa-black1/30'
		: 'border-dsa-black3 bg-white dark:border-dsa-black2 dark:bg-dsa-black'}"
>
	<!-- QR preview -->
	<div
		style="width:{PREVIEW_SIZE}px; height:{PREVIEW_SIZE}px; border-radius:{preset.style
			.borderRadius ?? '8px'}; background:{preset.style.background ?? '#ffffff'}; overflow:hidden;"
		{@attach mountQR}
	></div>

	<p class="text-center text-sm font-semibold dark:text-white">{preset.name}</p>

	<label class="flex cursor-pointer items-center gap-1.5 text-sm dark:text-white">
		<input
			type="checkbox"
			{checked}
			onchange={onToggle}
			class="accent-dsa-red"
		/>
		Include
	</label>

	<button
		onclick={handleExport}
		disabled={exporting}
		class="w-full rounded-md border border-dsa-black2 bg-white px-2 py-1 text-xs font-medium
		       hover:bg-dsa-red4 disabled:opacity-50 dark:border-dsa-black3 dark:bg-dsa-black1
		       dark:text-white dark:hover:bg-dsa-black2"
	>
		{exporting ? 'Exporting…' : '↓ Download config'}
	</button>

	{#if onRemove}
		<button
			onclick={onRemove}
			class="text-xs text-dsa-black2 underline hover:text-dsa-red dark:text-dsa-black3 dark:hover:text-dsa-red1"
		>
			Remove
		</button>
	{/if}
</div>
