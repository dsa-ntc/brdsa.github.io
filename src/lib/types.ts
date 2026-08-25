import type { Component } from "svelte";

/** 
 * This type models the frontmatter of a Markdown blog post file.
*/
export interface PostMetadata {
	title: string;
	date?: string;
	author?: string;
	subtitle?: string; // Computed subtext shown in listings (e.g. recipe summary)
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

export interface SearchItem  {
	category?: string;
	title?: string;
	slug: string;
	text?: string;
}

export interface SearchResult {
	slug: string;
	category: string;
	title: string;
	text: string[];
}

export type PostModules = Record<
	string,
	() => Promise<{default: Component; metadata: PostMetadata;}>
>;

export type recipeModules = Record<
	string,
	() => Promise<{default: Component; metadata: recipe;}>
>;

export interface QRPresetProps {
	width?: number;
	height?: number;
	margin?: string | number;
	dotsOptions?: Record<string, unknown>;
	cornersSquareOptions?: Record<string, unknown>;
	cornersDotOptions?: Record<string, unknown>;
	imageOptions?: Record<string, unknown>;
	qrOptions?: Record<string, unknown>;
}

export interface QRPreset {
	id: string;
	name: string;
	image?: string; // logo URL; defaults to BRDSA logo if omitted
	props: QRPresetProps;
	style: { borderRadius?: string; background?: string };
	frame: null;
}