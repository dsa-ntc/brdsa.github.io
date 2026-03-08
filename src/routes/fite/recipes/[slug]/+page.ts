import { getRecipeModules, getRecipes, findPathForSlug } from '$lib/recipeUtils';
import { error } from '@sveltejs/kit';
import type { Picture } from 'vite-imagetools';
import type { EntryGenerator, PageLoad } from './$types';

// SvelteKit pages are expected to export this load function
// this params object provides info about the current request, such as which slug is in the URL

export const load: PageLoad = (async ({ params }) => {
	try {
		const posts = getRecipeModules();
		const filePath = findPathForSlug(params.slug);
		if (!filePath) throw new Error('Recipe not found');
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
				...metadata
			},
			hero,
			component
		};
	} catch (err) {
		console.error('Error loading recipe:', err);
		throw error(404, 'recipe not found');
	}
}) satisfies PageLoad;

// because /blog/[slug] is a dynamic route, we need to let SvelteKit know to pre-render our blog posts
// we do this by globbing over the posts dir
// https://svelte.dev/docs/kit/page-options#entries
export const entries: EntryGenerator = () => {
	const posts = getRecipes(true);
	const slugs = posts.map((p) => ({ slug: p.slug ?? 'no-slug' }));
	return slugs;
};
