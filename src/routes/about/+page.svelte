<script lang="ts">
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import About from "./about.md";
	import hero from "$lib/images/Debs.jpg?enhanced";
	import HeadSummary from "$lib/components/HeadSummary.svelte";

	const title = "About Baton Rouge DSA";
	const description = "Learn more about BRDSA";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>About us</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<div class="items-center @2xl:flex @2xl:gap-3">
				<blockquote class="min-w-xs @md:min-w-sm">
					The Republican and Democratic parties, or, to be more exact, the Republican-Democratic
					party, represents the capitalist class in the class struggle. They are the political wings
					of the capitalist system and such differences as arise between them relate to spoils and
					not to principles.
					<footer>
						<cite class="dark:font-bold">
							-- <a href="https://www.marxists.org/archive/debs/works/1904/sp_wkingclss.htm"
								>Eugene V. Debs</a
							>, The Socialist Party and the Working Class, 1904</cite
						>
					</footer>
				</blockquote>
				<figure>
					<enhanced:img
						src={hero}
						title="Eugene V. Debs"
						alt="Portrait of Eugene V. Debs"
						class="float-right mt-0 mb-0 max-h-55 object-scale-down py-2"
					/>
					<figcaption class="min-w-3xs">
						<a href="https://www.dol.gov/general/aboutdol/hallofhonor/1990_debs" target="_blank" rel="noopener noreferrer"
							>U.S. Department of Labor</a
						>
					</figcaption>
				</figure>
			</div>
		</Prose>
	</div>

	<div class="flex justify-center p-2">
		<Prose>
			<About />
		</Prose>
	</div>
</article>
