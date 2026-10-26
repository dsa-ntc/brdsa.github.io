<script lang="ts">
	import {
    SvelteURLSearchParams
  } from 'svelte/reactivity';

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
		const p = new SvelteURLSearchParams();
		p.set("full", full.toString());
		p.set("breakout", breakout.toString());
		if (onlyEventSessionIds?.length)
			p.set("only_event_session_ids", onlyEventSessionIds.join(","));
		return p.toString();
	});

	let src = $derived(
		`https://brdsa.solidarity.tech/${path}/embed${params ? `?${params}` : ""}`,
	);

	let iframe: HTMLIFrameElement | undefined = $state();

	// The embed script sets the iframe's height from a message sent by the embedded page. That
	// message can arrive before hydration (or before the script registers this iframe), and the
	// height is then never applied, leaving the iframe at the browser default of 150px.
	// Asking the script to re-measure once we're mounted makes the result deterministic.
	function remeasure() {
		const embeds = (window as { SolidarityEmbeds?: { load(): void; resize(el: Element): void } })
			.SolidarityEmbeds;
		if (!iframe || !embeds) return;
		embeds.load();
		embeds.resize(iframe);
	}

	$effect(() => {
		if (!iframe) return;
		// the script may still be loading; retry briefly until it exists
		const timers = [0, 500, 1500].map((ms) => setTimeout(remeasure, ms));
		return () => timers.forEach(clearTimeout);
	});
</script>

<svelte:head>
	<script src="https://brdsa.solidarity.tech/embed/v1.js" async></script>
</svelte:head>

<!-- Height is set by the embed script; keep layout in classes so Svelte never rewrites its inline style. -->
<iframe
	bind:this={iframe}
	data-st-embed
	{src}
	allow="payment *"
	class="block w-full max-w-full overflow-hidden border-0"
	style:min-height={minHeight}
	onload={remeasure}
	{title}
></iframe>
