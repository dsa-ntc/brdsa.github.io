<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import Link from "$lib/components/Link.svelte";
	import SolidarityTechEmbed from "$lib/components/SolidarityTechEmbed.svelte";
	const description = "Information about donating to Baton Rouge DSA";
	const title = "Donate to BRDSA";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article class="@container flex grow flex-col">
	<PaletteHeader>Donate to BRDSA</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				Want to see where your money goes? Come to <Link href="/get-involved"
					>our next chapter meeting</Link
				> and see what we're up to!
			</p>
			<SolidarityTechEmbed path="donate" title="Direct Donation to BR DSA" minHeight="800px" />
		</Prose>
	</div>
</article>
