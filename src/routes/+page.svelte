<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Posts from "$lib/components/Posts.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import hero from "$lib/images/Header_ABetterWorld_Louisiana.jpeg?enhanced";
	import foodDistribution from "$lib/images/baton-rouge-dsa-cover-image.jpg?enhanced";
	import type { PageProps } from "./$types";
	import About from "./about/about.md";
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	let { data }: PageProps = $props();
	const { title } = data;
	const description = "Home page for Baton Rouge DSA";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
	<link
		href="https://actionnetwork.org/css/style-embed-whitelabel-v3.css"
		rel="stylesheet"
		type="text/css"
	/>
</svelte:head>

<article>
	<PaletteHeader>Welcome to Baton Rouge DSA</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<blockquote>
				How many men ever went to a barbecue and would let one man take off the table what was
				intended for nine-tenths of the people?
				<footer class="text-right">
					<cite class="font-bold">-- Huey P. Long, 1934</cite>
				</footer>
			</blockquote>
			<enhanced:img
				src={hero}
				alt="A graphic that says 'A Better World is Possible!'"
				class="mx-auto"
			/>
		</Prose>
	</div>

	<div class="flex flex-col bg-white/90 @5xl:flex-row @5xl:justify-center dark:bg-dsa-black/90">
		<Prose>
			<About />
		</Prose>
		<aside>
			<enhanced:img
				src={foodDistribution}
				alt="BR DSA members distribute food"
				class="object-scale-down"
			/>
		</aside>
	</div>

	<div class="mx-auto max-w-5xl grow p-2">
		<style>
			.can_embed #can_embed_form #can_embed_form_inner input[type="checkbox"] {
				border-color: var(--color-dsa-red) !important;
				accent-color: var(--color-red-500) !important;
				appearance: auto !important;
			}
			@media (prefers-color-scheme: dark) {
				.can_embed #can_embed_form_inner input[type="checkbox"] {
					border: 1px !important;
					border-color: var(--color-red) !important;
				}
			}
		</style>
		<script
			src="https://actionnetwork.org/widgets/v5/form/join-brdsa?format=js&source=widget"
			fetchpriority="low"
		></script>
		<div id="can-form-area-join-brdsa" class="w-full bg-white/80 dark:bg-dsa-black/80"></div>
	</div>

	<div class="palette-sibling mt-4">
		<div class="flex justify-center">
			<Prose adhocStyle="width:100%">
				<p
					class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
				>
					Here are some recent posts from us
				</p>
			</Prose>
		</div>
		<Posts {data} />
	</div>
</article>
