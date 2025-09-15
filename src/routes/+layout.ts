// this line is required to use static site generation
// https://svelte.dev/docs/kit/adapter-static
export const prerender = true;
// our MFM host is Apache, enable trailing slash to conform to its expectation for an index.html at each route
export const trailingSlash = 'always';