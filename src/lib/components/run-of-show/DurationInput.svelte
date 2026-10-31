<script lang="ts">
	interface Props {
		/** Duration in seconds. */
		value: number;
		label: string;
	}

	let { value = $bindable(), label }: Props = $props();

	const inputClass = `w-14 rounded border border-dsa-black3 bg-white px-1.5 py-1 text-sm
		focus:border-dsa-red focus:outline-none dark:border-dsa-black2 dark:bg-dsa-black dark:text-white`;

	// Both fields edit the same total, so stepping seconds past 59 (or below 0) carries into minutes.
	const setSeconds = (seconds: number) => (value = Math.max(0, seconds));
</script>

<div class="flex items-center gap-1">
	<input
		type="number"
		min="0"
		bind:value={() => Math.floor(value / 60), (m) => setSeconds((m ?? 0) * 60 + (value % 60))}
		aria-label="{label} minutes"
		class={inputClass}
	/>
	:
	<input
		type="number"
		bind:value={() => value % 60, (s) => setSeconds(Math.floor(value / 60) * 60 + (s ?? 0))}
		aria-label="{label} seconds"
		class={inputClass}
	/>
</div>
