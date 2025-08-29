import { json } from '@sveltejs/kit'
import { getRecipes } from '$lib/recipeUtils';

export async function GET() {
	
	try {
		const posts = getRecipes();
		return json(posts);
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
}
