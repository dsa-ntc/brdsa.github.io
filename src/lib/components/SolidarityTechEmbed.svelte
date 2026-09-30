<script lang="ts">
	// https://www.solidarity.tech/docs/integrate-a-form-into-external-website#options
	// bug: currently 2026-09-30 the full option isn't respected by the embed script
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
		minHeight,
		full = false,
		breakout = false,
		onlyEventSessionIds,
	}: Props = $props();

	let params = $derived.by(() => {
		const p = new URLSearchParams();
		p.set("full", full.toString());
		p.set("breakout", breakout.toString());
		if (onlyEventSessionIds?.length)
			p.set("only_event_session_ids", onlyEventSessionIds.join(","));
		return p.toString();
	});

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
	style="display:block;width:100%;max-width:100%;border:none;overflow:hidden;{minHeight ? `min-height: ${minHeight};` : ''};"
	
	{title}
></iframe>
