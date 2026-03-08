<script lang="ts">
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import About from "./bylaws.md";
	import HeadSummary from "$lib/components/HeadSummary.svelte";

	const title = "Bylaws of Baton Rouge DSA";
	const description = "";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>Bylaws</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				Adopted March 8, 2019; approved by the NPC 11/17/2019
			</p>
		</Prose>
	</div>

	<div class="flex justify-center p-2">
		<Prose>
			<About />
		</Prose>
	</div>
</article>
