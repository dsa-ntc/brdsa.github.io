<script lang="ts">
	import {
		formatDuration,
		totalSeconds,
		type ScheduledSegment,
		type ShowDetails
	} from "$lib/runOfShow";
	import RuntimeStatus from "./RuntimeStatus.svelte";

	interface Props {
		details: ShowDetails;
		scheduled: ScheduledSegment[];
	}

	const { details, scheduled }: Props = $props();

	const crew = $derived(
		[
			["Air date", details.airDate],
			["Hosts", details.hosts],
			["Director", details.director],
			["Technical director", details.technicalDirector],
			["Audio engineer", details.audioEngineer]
		].filter(([, value]) => value)
	);
	const hasClock = $derived(scheduled.some((s) => s.clockBegin !== null));
</script>

<!-- The reading and printing view: plain table, no controls, black on white when printed. -->
<section class="space-y-3 print:text-black">
	<header>
		<h2 class="text-2xl font-bold">{details.title || "Run of show"}</h2>
		{#if crew.length}
			<dl class="mt-1 flex flex-wrap gap-x-6 gap-y-0.5 text-sm">
				{#each crew as [label, value] (label)}
					<div class="flex gap-1">
						<dt class="font-bold">{label}:</dt>
						<dd>{value}</dd>
					</div>
				{/each}
			</dl>
		{/if}
	</header>

	<table class="w-full border-collapse text-sm tabular-nums">
		<thead>
			<tr class="border-b-2 border-current text-left">
				<th class="py-1 pr-3">Segment</th>
				<th class="px-3 py-1">Duration</th>
				<th class="px-3 py-1">Begin</th>
				<th class="px-3 py-1">End</th>
				{#if hasClock}
					<th class="px-3 py-1">Clock</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each scheduled as s (s.id)}
				<tr class="border-b border-dsa-black3 break-inside-avoid">
					<td class="py-1.5 pr-3 font-bold">{s.title}</td>
					<td class="px-3 py-1.5">{formatDuration(s.seconds)}</td>
					<td class="px-3 py-1.5">{formatDuration(s.begin)}</td>
					<td class="px-3 py-1.5">{formatDuration(s.end)}</td>
					{#if hasClock}
						<td class="px-3 py-1.5 whitespace-nowrap">{s.clockBegin} – {s.clockEnd}</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>

	<RuntimeStatus planned={totalSeconds(scheduled)} runtime={details.runtime} />
</section>
