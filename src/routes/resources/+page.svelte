<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	const description = "Information and resources collected by BRDSA";
	const title = "Resources";
	import Resources from "./resources.md";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>Resources</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				This page is always being updated. Please email contact@brdsa.org if you have a suggestion!
			</p>
		</Prose>
	</div>
	<div class="flex justify-center">
		<Prose>
			<Resources />
		</Prose>
	</div>
</article>
