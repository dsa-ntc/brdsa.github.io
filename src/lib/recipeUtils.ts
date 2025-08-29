import type { recipe, recipeModules } from "./types";

// NOTE this is pretty much just copy/pasted from the postUtils to allow for minor differences in loading without complicating things too much. consider merging later if it gets out of hand

// Convert file path to default slug (filename without extension)
export function pathToSlug(path: string): string {
	return path.replace("/src/lib/posts/recipes/", "").replace(".md", "");
}

// Convert slug back to file path
export function slugToPath(slug: string): string {
	return `/src/lib/posts/recipes/${slug}.md`;
}

export function getRecipeModules(): recipeModules {
	return import.meta.glob("/src/lib/posts/recipes/*.md") as recipeModules;
}

// Get all posts with metadata (eager loading for immediate access)
export function getrecipes(includeHidden = false): recipe[] {
	const paths = import.meta.glob("/src/lib/posts/recipes/*.md", { eager: true });
	const posts: recipe[] = [];
	const seenSlugs = new Set<string>();

	for (const [path, file] of Object.entries(paths)) {
		if (file && typeof file === "object" && "metadata" in file) {
			const metadata = file.metadata as recipe;

			// Use custom slug from frontmatter, or fall back to filename
			const slug = metadata.slug || pathToSlug(path);

			// Check for duplicate slugs
			if (seenSlugs.has(slug)) {
				throw new Error(`Duplicate slug detected: ${slug} (from ${path})`);
			}
			seenSlugs.add(slug);

			const post: recipe = {
				...metadata,
				slug, // Ensure slug is always present
				author: metadata.author || "Baton Rouge DSA",
				hidden: metadata.hidden || false
			};

			// Only include non-hidden posts unless explicitly requested
			if (includeHidden || !post.hidden) {
				posts.push(post);
			}
		}
	}

	// Sort by date (newest first)
	posts.sort((a, b) => {
		if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
		else return -1;
	});
	return posts;
}

export function getSummary(recipe: recipe) {
	const values = [];
	values.push(recipe.difficulty);
	if (recipe.cookTime) values.push(recipe.cookTime);
	if (recipe.feeds) values.push(`feeds ${recipe.feeds}`);
	return values.join(", ");
}

// Get a single post by slug (for dynamic routes)
export async function getPostBySlug(targetSlug: string): Promise<recipe | null> {
	const modules = getRecipeModules();
	// First, try to find by custom slug in frontmatter
	for (const [path, moduleLoader] of Object.entries(modules)) {
		const module = await moduleLoader();
		const metadata = (module as Record<string, unknown>).metadata as recipe;
		const slug = metadata.slug || pathToSlug(path);

		if (slug === targetSlug) {
			return {
				...metadata,
				slug,
				author: metadata.author || "Baton Rouge DSA",
				hidden: metadata.hidden || false
			};
		}
	}

	return null;
}
