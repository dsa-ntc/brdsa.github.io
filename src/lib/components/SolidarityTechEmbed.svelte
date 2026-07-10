<script lang="ts">
	interface Props {
		path: string;
		title: string;
		minHeight?: string;
	}

	let { path, title, minHeight = "500px" }: Props = $props();
</script>

<svelte:head>
	<script src="https://brdsa.solidarity.tech/embed/v1.js" async></script>
</svelte:head>

<iframe
	data-st-embed
	src="https://brdsa.solidarity.tech/{path}/embed"
	allow="payment *"
	style="display:block;width:100%;max-width:100%;border:none;overflow:hidden;min-height:{minHeight};"
	scrolling="no"
	{title}
></iframe>
