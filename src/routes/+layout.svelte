<script lang="ts">
	import PaletteBackground from "$lib/components/PaletteBackground.svelte";
	import "../app.css";
	let { data, children } = $props();
	import Socials from "$lib/components/Socials.svelte";
	import { page } from "$app/state";
	import logo from "$lib/images/BRDSAlogo_3ColorOnWhite.png?enhanced";
	import { config } from "$lib/config";
	import searchIcon from "$lib/images/magnifying-glass-solid-full_red.svg";

	import { onMount } from "svelte";
	import { createPostsIndex, searchPostsIndex } from "$lib/search";
	import type { SearchResult } from "$lib/types";
	import pageIcon from "$lib/images/file-lines-regular-full-white.svg";
	import foodIcon from "$lib/images/bowl-rice-solid-full-white.svg";
	import Link from "$lib/components/Link.svelte";

	let search: "loading" | "ready" = $state("loading");
	let searchTerm = $state("");
	let results: SearchResult[] = $state([]);

	onMount(async () => {
		const posts = await fetch("/search.json").then((res) => res.json());
		createPostsIndex(posts);
		search = "ready";
	});

	const watchPopoverToggle = () => {
		const popover = document.getElementById("searchbox");
		popover?.addEventListener("toggle", (e) => {
			if (e.newState === "open") {
				const searchInput = document.getElementById("searchInput");
				// focusVisible forces the browser to show its focus ring (not yet in TS types)
				searchInput?.focus({ focusVisible: true } as FocusOptions);
			} else {
				searchTerm = "";
			}
		});
	};

	const clearSearch = () => {
		searchTerm = "";
		const popover = document.getElementById("searchbox");
		popover?.hidePopover();
	}

	$effect(() => {
		if (search === "ready") {
			// runs each time `searchTerm` updates
			results = searchPostsIndex(searchTerm);
		}
	});
</script>
<svelte:window onload={watchPopoverToggle}></svelte:window>
<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta property="og:title" content={data.title} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={`${config.location}/images/BRDSAlogo_3ColorOnWhite.png`} />
	<meta property="og:url" content={page.url.toString()} />
</svelte:head>

<header class="@container flex items-center">
	<div class="ml-1 hidden h-15 w-15 rounded-full p-0.5 transition hover:scale-105 @md:block">
		<Link href="/" title="Go to the BRDSA home page">
			<span class="hidden">Go to the home page</span>
			<enhanced:img src={logo} alt="BRDSA logo" />
		</Link>
	</div>
	<nav
		title="main pages"
		class="text-md flex @sm:text-lg @md:ml-auto @md:text-xl @3xl:text-2xl @4xl:text-3xl"
	>
		<ul class="flex flex-wrap gap-x-5 px-2">
			<li class="@md:hidden">
				<Link href="/" class="font-bold text-dsa-red dark:text-dsa-red1" title="go to the home page"
					>Home</Link
				>
			</li>
			{#if search === "ready"}
			<li class="searchIcon">
				<button
					popovertarget="searchbox"
					aria-label="Toggle Search box"
					title="Toggle Search"
					class="group"
					><img src={searchIcon} alt="Search Icon" class="searchImage dark:darkIcon" />
					<div
						id="searchUnderline"
						class="h-0.5 w-0 bg-dsa-red transition-all duration-500 group-hover:w-full dark:bg-dsa-red1"
					></div>
				</button>
			</li>
			{/if}
			{#each data.sections as { title, link, caption } (link)}
				<li>
					<Link href={link} class="group font-bold text-dsa-red dark:text-dsa-red1" title={caption}>
						{title}
						<div
							class="h-0.5 w-0 bg-dsa-red transition-all duration-500 group-hover:w-full dark:bg-dsa-red1"
						></div>
					</Link>
				</li>
			{/each}
		</ul>
	</nav>
</header>
<main class="flex grow">
	
		<div id="searchbox" popover="auto">
			<div class="search">
				<p class="instructions">
					Search <img src={pageIcon} alt="Page Icon" />Statements and
					<img src={foodIcon} alt="Food Icon" />Recipes
				</p>
				<input
					bind:value={searchTerm}
					placeholder="Search"
					autocomplete="off"
					spellcheck="false"
					type="search"
					id="searchInput"
					name="searchInput"
					class="rounded-sm p-1 ring-1 ring-dsa-red1 focus:border-dsa-red1 focus:ring-2 focus:outline-none"
				/>

				<div class="results">
					{#if results}
						<ul>
							{#each results as result (result.slug)}
							<li>
								<Link href={result.slug} onclick={clearSearch}>
									<h3>
										{#if "Statement" == result.category}
										<img src={pageIcon} alt="Page Icon" />
										{:else}
										<img src={foodIcon} alt="Food Icon" />
										{/if}
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										<b>{@html result.category}:</b>
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html result.title}
									</h3>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									<p>{@html result.text}</p>
								</Link>
							</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>

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
