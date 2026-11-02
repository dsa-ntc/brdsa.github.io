<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import Link from "$lib/components/Link.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import { config } from "$lib/config";

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
					href={config.newsletterUrl}
					target="_blank"
					rel="noopener noreferrer">Join our email list</a
				>.
			</p>
		</Prose>
	</div>
	<nav class="mx-auto flex max-w-xl flex-col gap-8 p-4">
		{#each data.years as { year, newsletters } (year)}
			<section>
				<h2 class="border-b-2 border-dsa-red pb-1 text-3xl font-bold dark:border-dsa-red1">{year}</h2>
				<ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
					{#each newsletters as newsletter (newsletter.href)}
						<li>
							<!-- these are static PDFs, not SvelteKit routes, so skip client-side routing -->
							<Link
								href={newsletter.href}
								target="_blank"
								rel="noopener noreferrer"
								data-sveltekit-reload
								class="text-xl underline decoration-dsa-red decoration-2 underline-offset-4 hover:decoration-dsa-red1"
								>{newsletter.title}</Link
							>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</nav>
</article>
