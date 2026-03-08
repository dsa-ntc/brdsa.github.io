<script lang="ts">
	import Link from "$lib/components/Link.svelte";

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric"
	};

	let { data, basePath = "/blog" } = $props();
	// NOTE on weird date parsing https://stackoverflow.com/a/31732581
</script>

<nav class="mx-auto flex max-w-xl grow p-2">
	<ul class="flex grow flex-col gap-8">
		{#each data.posts as post (post.slug)}
			<li class="flex flex-col gap-1 rounded-md border border-dsa-red3 p-2 shadow-sm">
				<Link href="{basePath}/{post.slug}" class="text-3xl underline decoration-dsa-red">{post.title}</Link>
				<div class="flex flex-row justify-between">
					{#if post.subtitle ?? post.author}
						<span>{post.subtitle ?? post.author}</span>
					{/if}
					{#if post.date}
						<em>
							<time>{new Date(post.date.replace(/-/g, '/').replace(/T.+/, '')).toLocaleDateString("en-us", options)}</time>
						</em>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</nav>
