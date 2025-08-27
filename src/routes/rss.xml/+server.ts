import { getPosts } from '$lib/postUtils';
import {config} from '$lib/config';
import type { PostMetadata } from '$lib/types';

export const prerender = true;

// to validate output, use https://validator.w3.org/feed/check.cgi 
// to see examples of valid output, see https://datatracker.ietf.org/doc/html/rfc4287#section-1.1

function getItemsForPost(post: PostMetadata)
{
    const values = ['<entry>'];
    values.push(`<title>${post.title}</title>`);
    values.push(`<link href="${config.location}/blog/${post.slug}" />`);
    values.push(`<id>${config.location}/blog/${post.slug}</id>`);
    if(post.date)
    {
        values.push(`<updated>${new Date(post.date).toISOString()}</updated>`);
        values.push(`<published>${new Date(post.date).toISOString()}</published>`);
        if(post.description)
            values.push(`<summary>${post.description}</summary>`);
    }
    values.push('</entry>');
    return values.join('\n');
}

export async function GET() {
	const posts = getPosts();
	return new Response(
		`
        <?xml version="1.0" encoding="utf-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
            <title>${config.title}</title>
            <link href="${config.location}"/>
            <link rel="self" type="application/atom+xml" href="${config.location}/rss.xml"/>
            <id>${config.location}/rss.xml</id>
            <subtitle>${config.description}</subtitle>
            <updated>${(new Date()).toISOString()}</updated>
            <author>
                <name>Baton Rouge DSA</name>
                <uri>${config.location}</uri>
                <email>${config.email}</email>
            </author>
            <generator>SvelteKit</generator>             
        ${posts.map((post) => getItemsForPost(post)).join('\n')}
        </feed>
        `.trim(),
		{
			headers: {
				'Content-Type': 'application/atom+xml'
			}
		}
	);
}
