import type { recipe } from '$lib/types';
import type { PageServerLoad } from '../../$types';

export const load: PageServerLoad = async ({fetch}) => {
    const stuff = await fetch('/api/recipes');
    const posts = await stuff.json() as recipe[];
    return  { posts };
};