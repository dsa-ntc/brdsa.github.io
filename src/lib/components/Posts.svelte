<script lang="ts">
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric"
	};

	let { data } = $props();
</script>

<nav class="mx-auto flex max-w-xl grow p-2">
	<ul class="flex grow flex-col gap-8">
		{#each data.posts as post}
			<li class="flex flex-col gap-1 rounded-md border border-dsa-red3 p-2 shadow-sm">
				<a href="/blog/{post.slug}" class="text-3xl underline decoration-dsa-red">{post.title}</a>
				<div class="flex max-w-3/4 flex-row justify-between">
					{#if post.title}
						<span>{post.author}</span>
					{/if}
					{#if post.date}
						<em>
							<time>{new Date(post.date).toLocaleDateString("en-us", options)}</time>
						</em>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</nav>
