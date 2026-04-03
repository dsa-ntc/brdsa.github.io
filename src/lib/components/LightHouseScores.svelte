<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend,
		Title,
		Colors,
		type ChartConfiguration
	} from "chart.js";

	Chart.register([
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend,
		Title,
		Colors
	]);

	import { data } from "$lib/data/lighthouse-scores.json";

	const pages = [...new Set(data.map((r) => r.page))];
	let chart: Chart | undefined = $state();
	let currentPage = $state("/");
	let canvasElement: HTMLCanvasElement | undefined = $state();

	const loadChart: Attachment = (element) => {
		canvasElement = element as HTMLCanvasElement;
		if (canvasElement) {
			chart = new Chart(canvasElement, getChartConfigForPage("/"));
		}

		return () => {
			chart?.destroy();
		};
	};

	function getDataForPage(build: "SvelteKit" | "Jekyll", page: string) {
		const item = data.filter((r) => r.build === build && r.page === page).at(0);
		if (!item) return [];
		return [item.accessibility, item.performance, item.bestPractices, item.seo];
	}

	function getChartConfigForPage(page: string) {
		return {
			type: "bar",
			data: {
				labels: ["Accessibility", "Performance", "Best practices", "SEO"],
				datasets: [
					{
						label: "Jekyll",
						data: getDataForPage("Jekyll", page)
					},
					{
						label: "SvelteKit",
						data: getDataForPage("SvelteKit", page)
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: `Results for ${page === "/" ? "home" : page}`
					}
				},
				aspectRatio: 2,
				maintainAspectRatio: false
			}
		} as ChartConfiguration<"bar", number[], string>;
	}

	function changePage(page: string) {
		currentPage = page;
		if (currentPage && canvasElement) {
			chart?.destroy();
			chart = new Chart(canvasElement, getChartConfigForPage(currentPage));
		}
	}
</script>

<em>click to view results for page</em>
<div class="my-2 flex flex-wrap justify-evenly gap-x-4 gap-y-2 sm:flex-row">
	{#each pages as page (page)}
		<button
			class="w-fit rounded-md border-2 border-dsa-red bg-dsa-black2 px-0.5 text-sm font-bold dark:text-white"
			onclick={() => changePage(page)}
			>{page === "/" ? "home" : page}
		</button>
	{/each}
</div>
<div class="bg-white" style="position: relative; height:40vh; width:100%">
	<canvas {@attach loadChart}></canvas>
</div>
