<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		children: Snippet;
	}

	let { href, children, ...rest }: Props = $props();
</script>

<!-- This component is the single place that renders internal anchor tags, so the
     no-navigation-without-resolve rule is suppressed here rather than at every call site. -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} {...rest}>
	{@render children()}
</a>
