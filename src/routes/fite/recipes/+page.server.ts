import type { recipe } from '$lib/types';
import { getSummary } from '$lib/recipeUtils';
import type { PageServerLoad } from '../../$types';

export const load: PageServerLoad = async ({fetch}) => {
    const stuff = await fetch('/api/recipes');
    const recipes = await stuff.json() as recipe[];
    const posts = recipes.map(r => ({ ...r, subtitle: getSummary(r) }));
    return  { posts };
};
