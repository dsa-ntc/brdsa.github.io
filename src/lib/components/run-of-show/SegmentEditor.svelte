<script lang="ts">
	import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
	import { flip } from "svelte/animate";
	import { formatDuration, makeSegment, type ScheduledSegment, type Segment } from "$lib/runOfShow";
	import DurationInput from "./DurationInput.svelte";

	interface Props {
		segments: Segment[];
		/** The same segments, in the same order, with their computed times. */
		scheduled: ScheduledSegment[];
	}

	let { segments = $bindable(), scheduled }: Props = $props();

	const flipDurationMs = 150;
	// Inputs get wider gaps; the computed output columns sit tight together in their own grid,
	// set off from the inputs by the left margin.
	const columns = "grid-cols-[1.5rem_minmax(10rem,1fr)_8rem_auto_1.5rem]";
	const outputs = "ml-6 grid grid-cols-[3.5rem_3.5rem_5.5rem_5.5rem] gap-x-1";

	function reorder(e: CustomEvent<DndEvent<Segment>>) {
		segments = e.detail.items;
	}

	function removeSegment(id: string) {
		segments = segments.filter((s) => s.id !== id);
	}
</script>

<div class="overflow-x-auto rounded-md border border-dsa-black3 dark:border-dsa-black2">
	<div class="min-w-3xl">
		<div
			class="grid {columns} items-end gap-2 bg-dsa-red4/40 px-2 py-1.5 text-xs font-bold
			       dark:bg-dsa-black1"
		>
			<span></span>
			<span>Segment</span>
			<span>Duration</span>
			<div class={outputs}>
				<span title="Time from the top of the show when the segment starts">Begin</span>
				<span title="Running total: time from the top of the show when the segment ends">End</span>
				<span>Clock begin</span>
				<span>Clock end</span>
			</div>
			<span></span>
		</div>

		<div
			use:dragHandleZone={{ items: segments, flipDurationMs, dropTargetStyle: {} }}
			onconsider={reorder}
			onfinalize={reorder}
		>
			{#each segments as segment, i (segment.id)}
				{@const times = scheduled[i]}
				<div
					animate:flip={{ duration: flipDurationMs }}
					class="grid {columns} items-center gap-2 border-t border-dsa-black3 bg-white px-2 py-1
					       text-sm dark:border-dsa-black2 dark:bg-dsa-black"
				>
					<div
						use:dragHandle
						aria-label="Drag to reorder {segment.title || 'segment'}"
						class="cursor-grab text-center text-dsa-black2 select-none hover:text-dsa-red
						       dark:text-dsa-black3 dark:hover:text-dsa-red1"
					>
						⠿
					</div>
					<input
						type="text"
						bind:value={segment.title}
						aria-label="Segment {i + 1} description"
						placeholder="Description"
						class="w-full rounded border border-dsa-black3 bg-white px-2 py-1 text-sm
						       focus:border-dsa-red focus:outline-none dark:border-dsa-black2 dark:bg-dsa-black
						       dark:text-white"
					/>
					<DurationInput bind:value={segment.seconds} label="Segment {i + 1} duration" />
					<div class="{outputs} font-mono">
						<span>{times ? formatDuration(times.begin) : ""}</span>
						<span>{times ? formatDuration(times.end) : ""}</span>
						<span class="text-xs">{times?.clockBegin ?? "—"}</span>
						<span class="text-xs">{times?.clockEnd ?? "—"}</span>
					</div>
					<button
						type="button"
						onclick={() => removeSegment(segment.id)}
						title="Remove segment"
						aria-label="Remove segment {i + 1}"
						class="text-sm text-dsa-black2 hover:text-dsa-red dark:text-dsa-black3
						       dark:hover:text-dsa-red1">✕</button
					>
				</div>
			{/each}
		</div>
	</div>
</div>

<button
	type="button"
	onclick={() => (segments = [...segments, makeSegment()])}
	class="mt-2 rounded-md border border-dsa-black3 bg-white px-3 py-1.5 text-sm font-medium
	       hover:bg-dsa-red4 dark:border-dsa-black2 dark:bg-dsa-black1 dark:text-white
	       dark:hover:bg-dsa-black2"
>
	+ Add segment
</button>
