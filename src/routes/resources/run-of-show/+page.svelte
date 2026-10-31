<script lang="ts">
	import { onMount } from "svelte";
	import { replaceState } from "$app/navigation";
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import ExportBar from "$lib/components/run-of-show/ExportBar.svelte";
	import RuntimeStatus from "$lib/components/run-of-show/RuntimeStatus.svelte";
	import ScheduleTable from "$lib/components/run-of-show/ScheduleTable.svelte";
	import SegmentEditor from "$lib/components/run-of-show/SegmentEditor.svelte";
	import ShowDetailsForm from "$lib/components/run-of-show/ShowDetailsForm.svelte";
	import { decodeHash, defaultPlan, encodeHash, schedule, totalSeconds } from "$lib/runOfShow";

	let plan = $state(defaultPlan());
	let view = $state(false);

	const scheduled = $derived(schedule(plan));

	// The plan lives in the URL hash so a link is the whole document. We load it after mount
	// because the page is prerendered, and don't write it back until that load has happened.
	// replaceState also throws if SvelteKit's router isn't up yet, which it isn't during the
	// first mount, so the first write waits a macrotask.
	let loaded = $state(false);
	onMount(() => {
		const shared = decodeHash(location.hash);
		if (shared) {
			plan = shared.plan;
			view = shared.view;
		}
		setTimeout(() => (loaded = true));
	});

	$effect(() => {
		const hash = encodeHash(plan, view);
		// only the hash changes, so this is not a navigation resolve() could help with
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		if (loaded) replaceState(hash, {});
	});
</script>

<svelte:head>
	<HeadSummary title="Run of Show" description="Plan a run of show for a radio broadcast" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<article>
	<div class="print:hidden">
		<PaletteHeader>Run of Show</PaletteHeader>
	</div>

	<div class="palette-sibling flex grow justify-center print:bg-transparent">
		<div class="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6">
			<ExportBar {plan} bind:view />

			<!-- Always in the DOM so printing works from either mode; only shown on screen when reading. -->
			<div class={view ? "" : "hidden print:block"}>
				<ScheduleTable details={plan.details} {scheduled} />
			</div>

			<div class="space-y-4 print:hidden" hidden={view}>
				<p class="text-sm">
					Add a segment for each topic, give it a duration (minutes and seconds), and drag the
					handle to reorder. Begin and end are measured from the top of the show; set a recording
					start time to see clock times.
				</p>
				<ShowDetailsForm bind:details={plan.details} />
				<SegmentEditor bind:segments={plan.segments} {scheduled} />
				<RuntimeStatus planned={totalSeconds(plan.segments)} runtime={plan.details.runtime} />
			</div>
		</div>
	</div>
</article>
