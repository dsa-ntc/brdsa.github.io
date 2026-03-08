import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { getPosts, getPostModules, findPathForSlug } from '$lib/postUtils';
import type { Picture } from 'vite-imagetools';

// SvelteKit pages are expected to export this load function
// this params object provides info about the current request, such as which slug is in the URL

export const load: PageLoad = (async ({ params }) => {
	try {
		const posts = getPostModules();
		const filePath = findPathForSlug(params.slug);
		if (!filePath) throw new Error('Post not found');
		const contentModule = posts[filePath];
		const { default: component, metadata } = await contentModule().then();


		const imageModules = import.meta.glob(
			'/src/lib/images/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
			{
				eager: true,
				query: {
					enhanced: true
				}
			}
		);

		let match: { default?: Picture } | undefined = undefined;
		let hero: Picture | undefined;
		if (metadata.imageUrl) {
			match = imageModules[`/src/lib/images/${metadata.imageUrl}`];
			if (match) hero = (match as { default?: Picture }).default;
		}

		return {
			post: {
				...metadata,
				slug: params.slug
			},
			hero,
			component
		};
	} catch (err) {
		console.error('Error loading post:', err);
		throw error(404, 'Post not found');
	}
}) satisfies PageLoad;

// because /blog/[slug] is a dynamic route, we need to let SvelteKit know to pre-render our blog posts
// we do this by globbing over the posts dir
// https://svelte.dev/docs/kit/page-options#entries
export const entries: EntryGenerator = () => {
	const posts = getPosts(true);
	const slugs = posts.map((p) => ({ slug: p.slug ?? 'no-slug' }));
	return slugs;
};
