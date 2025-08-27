<script lang="ts">
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import GetInvolved from "../get-involved.md";
	import hero from "$lib/images/Ella_Baker.jpg?enhanced";
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	const description = "How you can get involved with Baton Rouge DSA";
	const title = "Get Involved";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>Get Involved</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<blockquote>
				We who believe in freedom cannot rest until it comes
				<footer>
					<cite class="dark:font-bold">
						-- <a href="https://en.wikipedia.org/wiki/Ella_Baker">Ella Baker</a>, 1964</cite
					>
				</footer>
			</blockquote>
			<figure>
				<enhanced:img
					src={hero}
					title="Ella Baker"
					alt="Ella Baker passionately speaking into a mic"
					class="float-right mt-0 mb-0 w-full py-2 lg:w-2/3"
				/>
				<figcaption>
					George Ballis via <a href="https://www.crmvet.org/images/imgfs.htm" class="text-nowrap"
						>Civil Rights Movement Archive</a
					>
				</figcaption>
			</figure>
		</Prose>
	</div>

	<div class="flex justify-center">
		<Prose>
			<p class="p-2 dark:text-white">
				Want to stay in the loop? <a
					href="https://actionnetwork.org/forms/join-brdsa"
					target="_blank">Join our email list</a
				> or <a href="https://share.mayfirst.org/remote.php/dav/public-calendars/rQ4iPFZf4smD47tP?export">click this link to subscribe to the calendar below</a>.
			</p>
		</Prose>
	</div>

	<div class="p-2">
		<iframe width="100%" height="750" src="https://share.mayfirst.org/apps/calendar/embed/rQ4iPFZf4smD47tP" 
			scrolling="no" title="BR DSA's Calendar"></iframe>
	</div>

	<div class="flex justify-center p-2">
		<Prose>
			<GetInvolved />
		</Prose>
	</div>
</article>
