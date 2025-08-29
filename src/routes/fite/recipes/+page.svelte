<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import { getSummary } from "$lib/recipeUtils";
	let { data } = $props();

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric"
	};
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
	<div class="flex justify-center">
		<Prose>
			<nav class="flex grow p-2">
				<ul class="flex grow flex-col gap-3">
					{#each data.posts as post}
						<li class="flex flex-col">
							<a href="/fite/recipes/{post.slug}" class="text-4xl underline decoration-dsa-red"
								>{post.title}</a
							>
							{#if post.date}
								<time>{new Date(post.date).toLocaleDateString("en-us", options)}</time>
							{/if}
							<span>{getSummary(post)}</span>
						</li>
					{/each}
				</ul>
			</nav>
		</Prose>
	</div>
</article>
