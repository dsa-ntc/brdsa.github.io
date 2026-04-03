<script lang="ts">
	import { config } from "$lib/config";
	const socials = config.socials;
	let { svgClass = "fill-dsa-black dark:fill-dsa-red2 h-5 w-5" } = $props();
</script>

<!-- 
@component
The Socials component renders svg icons and links.
-->

<ul class="flex items-center justify-evenly gap-0.5 py-1 md:justify-end md:gap-3">
	<li>
		<a href={socials.Instagram} target="_blank" rel="external noopener noreferrer">
			{@render instagram()}
			<span class="hidden">Instagram</span>
		</a>
	</li>
	<li>
		<a href={socials.Bluesky} target="_blank" rel="external noopener noreferrer">
			{@render bluesky()}
			<span class="hidden">Bluesky</span>
		</a>
	</li>
	<li>
		<a href={socials.Facebook} target="_blank" rel="external noopener noreferrer">
			{@render facebook()}
			<span class="hidden">Facebook</span>
		</a>
	</li>
	<li>
		<a href={socials.Twitter} target="_blank" rel="external noopener noreferrer">
			{@render twitter()}
			<span class="hidden">Twitter</span>
		</a>
	</li>
	<li>
		<a href={socials.GitHub} target="_blank" rel="external noopener noreferrer">
			{@render github()}
			<span class="hidden">GitHub</span>
		</a>
	</li>
	<li>
		<a href={socials.EmailUs} target="_blank" rel="external noopener noreferrer">
			{@render send()}
			<span class="hidden">Email us</span>
		</a>
	</li>
	<li>
		<a href={socials.Newsletter} target="_blank" rel="external noopener noreferrer">
			{@render mail()}
			<span class="hidden">Newsletter </span>
		</a>
	</li>
	<li>
		<a href={`${config.location}/rss.xml`} rel="external">
			{@render rss()}
			<span class="hidden">RSS feed</span>
		</a>
	</li>
	<li>
		<a href={`${config.location}/sitemap.xml`} rel="external">
			{@render sitemap()}
			<span class="hidden">Sitemap</span>
		</a>
	</li>
</ul>

<!--
    below are svelte snippets for each of the svg icons we use
    why go through the trouble of this? you might wonder
    well, font icon libraries suck, and we only need a few icons, and inlining them
    makes for a faster page load. by tucking the noisy elements in these snippets, 
    it makes it easier to read/re-order the links, or use them elsewhere
    i think there's a way to export snippets, but for all that maybe just make them components

    https://simpleicons.org/
    https://tabler.io/icons

  -->

{#snippet instagram()}
	<svg role="img" aria-label="The Instagram logo" viewBox="0 0 24 24" class={svgClass}
		><title>Instagram</title><desc>The Instagram logo</desc><path
			d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
		/></svg
	>
{/snippet}

{#snippet bluesky()}
	<svg role="img" aria-label="The Bluesky logo" viewBox="0 0 24 24" class={svgClass}
		><title>Bluesky</title><desc>The Bluesky logo</desc><path
			d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
		/></svg
	>
{/snippet}

{#snippet facebook()}
	<svg role="img" aria-label="The Facebook logo" viewBox="0 0 24 24" class={svgClass}
		><title>Facebook</title><desc>The Facebook logo</desc><path
			d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
		/></svg
	>
{/snippet}

{#snippet twitter()}
	<svg role="img" aria-label="The Twitter logo" viewBox="0 0 24 24" class={svgClass}
		><title>Twitter</title><desc>The Twitter logo</desc><path
			d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"
		/></svg
	>
{/snippet}

{#snippet github()}
	<svg role="img" aria-label="The GitHub logo" viewBox="0 0 24 24" class={svgClass}
		><title>GitHub</title><desc>The GitHub logo</desc><path
			d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
		/></svg
	>
{/snippet}

{#snippet mail()}
	<svg
		class={svgClass}
		aria-label="Icon of an envelope"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		><title>Envelope icon</title><desc>Icon of an envelope</desc><path
			stroke="none"
			d="M0 0h24v24H0z"
			fill="none"
		/><path
			d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z"
		/><path
			d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z"
		/></svg
	>
{/snippet}

{#snippet send()}
	<svg
		class={svgClass}
		aria-label="Icon of a paper airplane"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><title>Paper airplane icon</title><desc>Icon of a paper airplane</desc><path
			stroke="none"
			d="M0 0h24v24H0z"
			fill="none"
		/><path d="M10 14l11 -11" /><path
			d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
		/></svg
	>
{/snippet}

{#snippet rss()}
	<svg
		class={svgClass}
		aria-label="Icon of the RSS feed symbol"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><title>RSS icon</title><desc>Icon of the RSS feed symbol</desc><path
			stroke="none"
			d="M0 0h24v24H0z"
			fill="none"
		/><path d="M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M4 4a16 16 0 0 1 16 16" /><path
			d="M4 11a9 9 0 0 1 9 9"
		/></svg
	>
{/snippet}

{#snippet sitemap()}
	<svg
		class={svgClass}
		aria-label="Icon representing a sitemap"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><path stroke="none" d="M0 0h24v24H0z" fill="none" /><title>Sitemap icon</title><desc
			>Icon of an sitemap</desc
		><path d="M3 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path
			d="M15 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
		/><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path
			d="M6 15v-1a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1"
		/><path d="M12 9l0 3" /></svg
	>
{/snippet}
