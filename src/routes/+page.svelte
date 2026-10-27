<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Link from "$lib/components/Link.svelte";
	import Posts from "$lib/components/Posts.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import SolidarityTechEmbed from "$lib/components/SolidarityTechEmbed.svelte";
	import hero from "$lib/images/Header_ABetterWorld_Louisiana.jpeg?enhanced";
	import foodDistribution from "$lib/images/baton-rouge-dsa-cover-image.jpg?enhanced";
	import type { PageProps } from "./$types";
	let { data }: PageProps = $props();
	let title = $derived(data.title);
	const description = "Home page for Baton Rouge DSA";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>Baton Rouge DSA</PaletteHeader>
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
			<p>
				The Baton Rouge Chapter of the Democratic Socialists of America is a working class organization fighting for the people of Greater Baton Rouge. We believe the economy and society should be run democratically to meet human needs, not to make profits.
			</p>
			<p class="flex flex-col gap-3">
				<Link href="/about">Learn more about who we are →</Link> 
				<Link href="/about/campaigns">See our work →</Link>
			</p>
		</Prose>
		<aside>
			<enhanced:img
				src={foodDistribution}
				alt="BRDSA members distribute food"
				class="object-scale-down max-h-135"
			/>
		</aside>
	</div>

	<PaletteHeader>	
		A better world is possible. Join us today.
	</PaletteHeader>
	<div class="palette-sibling">
		<div class="flex justify-center">
			<Prose adhocStyle="width:100%">
				<p
					class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
				>
					Use this form to join our chapter and get involved in our work. We will reach out to you with more information about how to get involved. You can opt out at any time. 
				</p>
			</Prose>
		</div>
	</div>

	

	<div class="flex justify-center bg-white/90 p-2 dark:bg-dsa-black/90">
		<div class="w-full max-w-3xl">
			<SolidarityTechEmbed path="join" title="Join Us!" full />
		</div>
	</div>

	<div class="palette-sibling mt-4">
		<div class="flex justify-center">
			<Prose adhocStyle="width:100%">
				<p
					class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
				>
					Here are some recent posts from us. <Link href="/blog">Read more here.</Link>
				</p>
			</Prose>
		</div>
		<Posts {data} />
	</div>
</article>
