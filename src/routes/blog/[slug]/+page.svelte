<script lang="ts">
	import HeadSummary from "$lib/components/HeadSummary.svelte";
	import PaletteHeader from "$lib/components/PaletteHeader.svelte";
	import Prose from "$lib/components/Prose.svelte";
	import dayjs from "dayjs";
	import customParseFormat from "dayjs/plugin/customParseFormat";
	import utc from "dayjs/plugin/utc";
	import timezone from "dayjs/plugin/timezone";
	
	dayjs.extend(customParseFormat);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	
	let { data } = $props();
	const { post, hero } = data;
	const { title, description } = post;
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "America/Denver"
	};
</script>

<svelte:head>
	<HeadSummary {title} description={description ?? title} />
</svelte:head>

<article>
	<PaletteHeader>
		{post.title}
	</PaletteHeader>

	<div class="palette-sibling flex justify-center">
		<Prose>
			<div class="p-x-2 dark:bg-dsa-black1 dark:text-white">
				{#if post.description}
					<p class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1">
						{post.description}
						{#if post.author}
							<br />
						{/if}
					</p>
				{/if}
				{#if post.author}
					<p class="px-2 text-center">
						{post.author} |
						{#if post.date}
							<time>{dayjs.tz(post.date, "YYYY-MM-DD", "America/Chicago").format("YYYY-MM-DD")}</time>.
						{/if}
					</p>
				{/if}
			</div>

			{#if hero}
				<enhanced:img
					src={hero}
					alt={post.imageDescription ?? "This image has no description"}
					class="-mt-7"
				/>
			{/if}
		</Prose>
	</div>
	<div class="flex justify-center indent-article">
		<Prose>
			<data.component></data.component>
		</Prose>
	</div>
</article>
