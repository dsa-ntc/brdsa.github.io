<script lang="ts">
	import { toCsv, type ShowPlan } from "$lib/runOfShow";

	interface Props {
		plan: ShowPlan;
		/** True when showing the read-only table instead of the editor. */
		view: boolean;
	}

	let { plan, view = $bindable() }: Props = $props();

	let copied = $state(false);

	async function downloadCsv() {
		const { saveAs } = await import("file-saver");
		const name = (plan.details.title || "run-of-show").trim().replace(/[^\w-]+/g, "-");
		saveAs(new Blob([toCsv(plan)], { type: "text/csv;charset=utf-8" }), `${name}.csv`);
	}

	// The URL hash is kept in sync with the plan by the page, so the address is the share link.
	async function copyLink() {
		await navigator.clipboard.writeText(location.href);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

{#snippet button(label: string, onclick: () => void)}
	<button
		type="button"
		{onclick}
		class="rounded-md border border-dsa-black3 bg-white px-3 py-1.5 text-sm font-medium
		       hover:bg-dsa-red4 dark:border-dsa-black2 dark:bg-dsa-black1 dark:text-white
		       dark:hover:bg-dsa-black2"
	>
		{label}
	</button>
{/snippet}

<div class="flex flex-wrap gap-2 print:hidden">
	{@render button(view ? "Edit" : "Reading view", () => (view = !view))}
	{@render button("Print", () => window.print())}
	{@render button("Download CSV", downloadCsv)}
	{@render button(copied ? "Link copied!" : "Copy share link", copyLink)}
</div>
