<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Posts from "$lib/components/Posts.svelte";
	import Prose from "$lib/components/Prose.svelte";
	let { data } = $props();

	const description = "FITE Recipes and Guides";
	const title = "FITE Cookbook";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>FITE Cookbook</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				This is a list of recipes submitted by <a href="/fite">FITE</a> contributors.
			</p>
		</Prose>
	</div>
	<Posts {data} basePath="/fite/recipes" />
</article>
