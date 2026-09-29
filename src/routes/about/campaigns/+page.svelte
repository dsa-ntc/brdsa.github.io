<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import Link from "$lib/components/Link.svelte";

	import hero from "$lib/images/Emma_Goldman_seated.jpg?enhanced";
	import Campaigns from "./our-work.md";
	const description = "Information about campaigns and projects by Baton Rouge DSA";
	const title = "Our work";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader headerClass="text-5xl font-bold pl-2 pb-3">Our Work</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<div class="@2xl:flex @2xl:items-center @2xl:gap-3">
				<blockquote class="min-w-xs">
					Liberty will not descend to a people, a people must raise themselves to liberty
					<footer class="text-right">
						<cite>
							-- grave of <a href="https://en.wikipedia.org/wiki/Emma_Goldman">Emma Goldman</a>
						</cite>
					</footer>
				</blockquote>
				<figure>
					<enhanced:img
						src={hero}
						title="Emma Goldman"
						alt="Portrait of Emma Goldman"
						class="float-right mt-0 mb-0 max-h-55 object-scale-down py-2"
					/>
					<figcaption class="min-w-2xs">
						<a
							href="https://commons.wikimedia.org/wiki/File:Emma_Goldman_seated.jpg"
							target="_blank">Takuma Kajiwara</a
						>, Public domain, via Wikimedia Commons
					</figcaption>
				</figure>
			</div>
		</Prose>
	</div>

	<div class="flex justify-center">
		<Prose>
			<Campaigns />
		</Prose>
	</div>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<h2>Want to join the fight?</h2>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				If you'd like to take action to support these initiatives, please <Link href="/get-involved"
					>check out our calendar</Link
				> to see what we have planned
			</p>
		</Prose>
	</div>
</article>
