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
	const title = "Statements by BRDSA";
	const description = "Statements and blog posts released by Baton Rouge DSA";
</script>

<svelte:head>
	<HeadSummary {title} {description} />
</svelte:head>

<article>
	<PaletteHeader>Statements</PaletteHeader>
	<div class="palette-sibling flex justify-center">
		<Prose>
			<p
				class="border-l-4 border-l-dsa-red p-2 dark:border-l-dsa-red1 dark:bg-dsa-black1 dark:text-white"
			>
				This is a list of statements released by our chapter.
			</p>
		</Prose>
	</div>
	<div class="flex justify-center">
		<Prose>
			<nav class="flex grow p-2">
				<ul class="flex grow flex-col gap-3">
					{#each data.posts as post}
						<li class="flex flex-col">
							<a href="/blog/{post.slug}" class="text-4xl underline decoration-dsa-red"
								>{post.title}</a
							>
							{#if post.date}
								<span>
									<time
										>{dayjs
											.tz(post.date, "YYYY-MM-DD", "America/Chicago")
											.format("YYYY-MM-DD")}.</time
									>
									{#if post.author}
										{post.author}
									{/if}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>
		</Prose>
	</div>
</article>
