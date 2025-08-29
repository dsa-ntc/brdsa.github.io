import type { Component } from "svelte";

/** 
 * This type models the frontmatter of a Markdown blog post file.
*/
export interface PostMetadata {
	title: string;
	date?: string;
	author?: string;
	slug?: string; // Custom slug from frontmatter
	hidden?: boolean; // Whether to hide from public post lists
	description?: string;
	tags?: string[];
	imageUrl?: string;
	imageDescription?: string;
}

export interface recipe extends PostMetadata {
	difficulty?: string;
	source?: string;
	feeds?: number;
	cookTime?: string;
	price?: string;
}

export type PostModules = Record<
	string,
	() => Promise<{default: Component; metadata: PostMetadata;}>
>;

export type recipeModules = Record<
	string,
	() => Promise<{default: Component; metadata: recipe;}>
>;
