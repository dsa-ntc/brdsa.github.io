// this line is required to use static site generation
// https://svelte.dev/docs/kit/adapter-static
export const prerender = true;
// we are deploying to some kind of linux (centos?) + apache host 
export const trailingSlash = 'always';