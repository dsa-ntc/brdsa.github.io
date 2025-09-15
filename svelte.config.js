import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	rehypePlugins:
		[
			[rehypeSlug],
			[rehypeAutolinkHeadings, { behavior: 'wrap'}]
		]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: false
		}),
		// have to set this to make the GH workflow work
		paths: {
			base: '',
			assets: ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				throw new Error(message);
			},
			handleMissingId: (({ message, id, path }) => {
				console.log(`skipping missing id error ${message}`)
				return;
			})
		}
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
