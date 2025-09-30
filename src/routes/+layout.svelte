<script lang="ts">
	import PaletteBackground from "$lib/components/PaletteBackground.svelte";
	import "../app.css";
	let { data, children } = $props();
	import Socials from "$lib/components/Socials.svelte";
	import { page } from "$app/state";
	import logo from "$lib/images/BRDSAlogo_3ColorOnWhite.png?enhanced";
	import { config } from "$lib/config";
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta property="og:title" content={data.title} />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content={`${config.location}/images/BRDSAlogo_3ColorOnWhite.png`}
	/>
	<meta property="og:url" content={page.url.toString()} />
</svelte:head>

<header class="@container flex items-center">
	<div class="ml-1 hidden h-15 w-15 rounded-full p-0.5 transition hover:scale-105 @md:block">
		<a href="/" title="Go to the BRDSA home page">
			<span class="hidden">Go to the home page</span>
			<enhanced:img src={logo} alt="BR DSA logo" />
		</a>
	</div>
	<nav
		title="main pages"
		class="text-md flex @sm:text-lg @md:ml-auto @md:text-xl @3xl:text-2xl @4xl:text-3xl"
	>
		<ul class="flex flex-wrap gap-x-5 px-2">
			<li class="@md:hidden">
				<a href="/" class="font-bold text-dsa-red dark:text-dsa-red1" title="go to the home page"
					>Home</a
				>
			</li>
			{#each data.sections as { title, link, caption }}
				<li>
					<a href={link} class="group font-bold text-dsa-red dark:text-dsa-red1" title={caption}>
						{title}
						<div
							class="h-[2px] w-0 bg-dsa-red transition-all duration-500 group-hover:w-full dark:bg-dsa-red1"
						></div>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>
<main class="flex grow">
	{@render children()}
</main>
<footer>
	<PaletteBackground reversed backgroundClass="opacity-65">
		<div class="md:hidden">
			<Socials />
			<address class="text-center text-lg">🐊 Baton Rouge DSA 🌹</address>
		</div>
		<div class="hidden grid-cols-3 md:grid">
			<div></div>
			<address class="text-center text-lg">🐊 Baton Rouge DSA 🌹</address>
			<Socials />
		</div>
	</PaletteBackground>
</footer>
