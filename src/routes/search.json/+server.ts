import { json } from '@sveltejs/kit'
import { getPosts } from '$lib/postUtils'
import { getRecipes } from '$lib/recipeUtils';
import type { PostMetadata, SearchItem } from '$lib/types';
import matter from 'gray-matter';

const patterns: Record<string, RegExp> = {
    frontmatter: /---.*?---/gs,
    code: /```.*?\n|```/gs,
    inline: /`([^`]*)`/g,
    heading: /^#{1,6}\s.*$/gm,
    link: /\[([^\]]+)\]\(([^)]+)\)/g,
    image: /\!\[.*?\]\(.*?\)/g,
    blockquote: /> /gm,
    bold: /\*\*/g,
    italic: /\b_([^_]+)_(?!\w)/g,
    special: /{%.*?%}/g,
    script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    tags: /[<>]/g,
}

const htmlEntities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
}

function stripMarkdown(markdown: string) {
    for (const pattern in patterns) {
        switch (pattern) {
            case 'inline':
                markdown = markdown.replace(patterns[pattern], '$1')
                break
            case 'tags':
                markdown = markdown.replace(
                    patterns[pattern],
                    (match) => htmlEntities[match]
                )
                break
            case 'link':
                markdown = markdown.replace(patterns[pattern], '$2')
                break
            case 'italic':
                markdown = markdown.replace(patterns[pattern], '$1')
                break
            case 'script':
                markdown = markdown.replace(patterns[pattern], '')
            default:
                markdown = markdown.replace(patterns[pattern], '')
        }
    }

    return markdown
}


export async function GET() {
    let fulllist: SearchItem[] = [];
    let exceptions = [];

    try {

        const paths = import.meta.glob("/src/lib/posts/*.md", { import: 'default', query: '?raw', eager: true });
        const entries = Object.entries(paths)
            .map(([k, content]) => {
                const frontmatter = matter(content as string);
                if (!frontmatter.data.hidden) {
                    return {
                        category: 'Statement',
                        title: frontmatter.data.title,
                        slug: '/blog/' + k.replace("/src/lib/posts/", "").replace(".md", ""),
                        description: frontmatter.data.description,
                        text: stripMarkdown(content as string)
                    }
                }
            })
            .filter(Boolean);

        const recipePath = import.meta.glob("/src/lib/posts/recipes/*.md", { import: 'default', query: '?raw', eager: true });
        const recipes = Object.entries(recipePath)
            .map(([k, content]) => {
                const frontmatter = matter(content as string);
                if (!frontmatter.data.hidden) {
                    return {
                        category: 'Recipe',
                        title: frontmatter.data.title,
                        slug: '/fite/recipes/' + k.replace("/src/lib/posts/recipes/", "").replace(".md", ""),
                        description: frontmatter.data.description,
                        text: stripMarkdown(content as string)
                    }
                }
            })
            .filter(Boolean);

        entries.forEach((e) => {
            fulllist.push(e);
        });

        recipes.forEach((r) => {
            fulllist.push(r);
        });

        //return json(entries);
        return json(fulllist);

    } catch (error) {
        console.error('Error fetching posts and recipes:', error);
        exceptions.push(json({ error: 'Failed to fetch posts and recipes' }, { status: 500 }));
    }
}
