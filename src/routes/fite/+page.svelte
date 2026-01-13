<script lang="ts">
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import Fite from "./fite.md";
	import hero from "$lib/images/FITE04-2025.png?enhanced";
	import mlk from "$lib/images/Martin_Luther_King_Jr.jpg?enhanced";
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	const description = "Information about our food distribution project Famine is the Enemy (FITE)";
	const title = "Famine Is The Enemy (FITE)";
	import fiteTent from "$lib/images/fite-tent.jpg?enhanced";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>{title}</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<div class="@2xl:flex @2xl:items-center @2xl:gap-3">
				<blockquote>
					The curse of poverty has no justification in our age. It is socially as cruel and blind as
					the practice of cannibalism at the dawn of civilization, when men ate each other because
					they had not yet learned to take food from the soil or to consume the abundant animal life
					around them.
					<footer>
						<cite class="dark:font-bold">
							-- <a href="https://projects.seattletimes.com/mlk/words-going.html"
								>Martin Luther King, Jr.</a
							></cite
						>
					</footer>
				</blockquote>
				<figure>
					<enhanced:img
						src={mlk}
						title="Martin Luther King Jr."
						alt="Portrait of Martin Luther King Jr."
						class="float-right mt-0 mb-0 max-h-55 object-scale-down py-2"
					/>
					<figcaption class="min-w-2xs">
						<a
							href="https://commons.wikimedia.org/wiki/File:Martin_Luther_King,_Jr..jpg"
							target="_blank"
						>
							Nobel Foundation
						</a>, Public domain, via Wikimedia Commons
					</figcaption>
				</figure>
			</div>
		</Prose>
	</div>

	<div class="flex grow flex-col @5xl:flex-row @5xl:justify-center">
		<Prose>
			<Fite />
		</Prose>
		<aside class="lg:pr-2">
			<enhanced:img src={fiteTent} alt="BR DSA members distribute food" />
		</aside>
	</div>
</article>
