<script lang="ts">
	import { formatDuration } from "$lib/runOfShow";

	interface Props {
		planned: number;
		runtime: number;
	}

	const { planned, runtime }: Props = $props();

	const diff = $derived(runtime - planned);
</script>

<p class="text-sm font-medium">
	Planned {formatDuration(planned)} of {formatDuration(runtime)}:
	{#if diff === 0}
		right on time
	{:else if diff > 0}
		{formatDuration(diff)} left to fill
	{:else}
		<strong class="text-dsa-red3 print:text-black">
			{formatDuration(-diff)} over
		</strong>
	{/if}
</p>
