<script lang="ts">
	interface Props {
		path: string;
		title: string;
		minHeight?: string;
		full?: boolean;
		breakout?: boolean;
		onlyEventSessionIds?: (string | number)[];
	}

	let {
		path,
		title,
		minHeight = "500px",
		full = false,
		breakout = false,
		onlyEventSessionIds,
	}: Props = $props();

	let params = $derived(
		[
			full && "full=true",
			breakout && "breakout=true",
			onlyEventSessionIds?.length &&
				`only_event_session_ids=${onlyEventSessionIds.join(",")}`,
		]
			.filter(Boolean)
			.join("&"),
	);

	let src = $derived(
		`https://brdsa.solidarity.tech/${path}/embed${params ? `?${params}` : ""}`,
	);
</script>

<svelte:head>
	<script src="https://brdsa.solidarity.tech/embed/v1.js" async></script>
</svelte:head>

<iframe
	data-st-embed
	{src}
	allow="payment *"
	style="display:block;width:100%;max-width:100%;border:none;overflow:hidden;min-height:{minHeight};"
	scrolling="no"
	{title}
></iframe>
