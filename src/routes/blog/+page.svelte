<script lang="ts">
	import Posts from "../../lib/components/Posts.svelte";

	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";

	let { data } = $props();
	const title = "Statements by BRDSA";
	const description = "Statements and blog posts released by Baton Rouge DSA";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>Statements</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				This is a list of statements released by members of our chapter.
			</p>
		</Prose>
	</div>
	<Posts {data} />
</article>
