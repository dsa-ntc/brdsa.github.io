<script lang="ts">
	import type { ShowDetails } from "$lib/runOfShow";
	import DurationInput from "./DurationInput.svelte";

	interface Props {
		details: ShowDetails;
	}

	let { details = $bindable() }: Props = $props();

	const inputClass = `w-full rounded border border-dsa-black3 bg-white px-2 py-1 text-sm
		focus:border-dsa-red focus:outline-none dark:border-dsa-black2 dark:bg-dsa-black dark:text-white`;
</script>

<section class="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
	<label class="text-sm font-bold">
		Show title
		<input type="text" bind:value={details.title} class={inputClass} />
	</label>
	<label class="text-sm font-bold">
		Air date
		<input type="text" bind:value={details.airDate} placeholder="N/A" class={inputClass} />
	</label>
	<label class="text-sm font-bold">
		Hosts
		<input type="text" bind:value={details.hosts} class={inputClass} />
	</label>
	<label class="text-sm font-bold">
		Director
		<input type="text" bind:value={details.director} class={inputClass} />
	</label>
	<label class="text-sm font-bold">
		Technical director
		<input type="text" bind:value={details.technicalDirector} class={inputClass} />
	</label>
	<label class="text-sm font-bold">
		Audio engineer
		<input type="text" bind:value={details.audioEngineer} class={inputClass} />
	</label>
	<div class="text-sm font-bold">
		Runtime (min : sec)
		<DurationInput bind:value={details.runtime} label="Runtime" />
	</div>
	<label class="text-sm font-bold">
		Recording start time
		<input type="time" bind:value={details.recordingTime} class={inputClass} />
	</label>
</section>
