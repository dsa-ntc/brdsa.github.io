<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import Link from "$lib/components/Link.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";

	let { data } = $props();
	const title = "Newsletters";
	const description = "Newsletters released by Baton Rouge DSA";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>Newsletters</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				This is an archive of newsletters sent to our chapter's email list. Want them in your inbox? <a
					href="https://actionnetwork.org/forms/join-brdsa"
					target="_blank">Join our email list</a
				>.
			</p>
		</Prose>
	</div>
	<nav class="mx-auto flex max-w-xl grow flex-col gap-8 p-2">
		{#each data.years as { year, newsletters } (year)}
			<section class="flex flex-col gap-4">
				<h2 class="text-4xl font-bold">{year}</h2>
				<ul class="flex flex-col gap-4">
					{#each newsletters as newsletter (newsletter.href)}
						<li class="rounded-md border border-dsa-red3 p-2 shadow-sm">
							<!-- these are static PDFs, not SvelteKit routes, so skip client-side routing -->
							<Link
								href={newsletter.href}
								target="_blank"
								data-sveltekit-reload
								class="text-3xl underline decoration-dsa-red">{newsletter.title}</Link
							>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</nav>
</article>
