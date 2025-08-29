<!-- omit from toc -->
# Baton Rouge DSA website

![dsa header](./src/lib/images/Header_ABetterWorld_Louisiana.jpeg)

## Customizing the website

You can edit the site using the online GitHub editor, but this is more suited to minor changes like adding posts/recipes, typos / text adjustments, adding links, etc. Cloning the repo to develop locally is recommended for any substantial changes.

### Adding pages

To add new pages (eg. `/about`, `/get-involved`), add a folder under `src/routes` and create a `+page.svelte` file there. Consider copying and editing an existing page to make this process easier. 

### Adding posts

Markdown files under `src/lib/posts` will be served as independent pages under the `/blog/[slug]` route, where the slug is the filename of the post. 

At the top of each markdown file is a block of frontmatter. These are properties that we use to help render the page. The `title` entry is **required**, while the others are optional but recommended.

The `hidden` property is used to prevent the post from appearing in the list of posts at `/blog`.

```yaml
---
title: Speech at Inauguration Day Rally 2025
date: 2025-01-20
description: This speech was given on January 20, 2025 by BRDSA member Jacob Newsom outside the Governor's mansion.
imageUrl: Inaug2025speechphoto.jpg
imageDescription: Jacob Newsom speaking outside the Governor's mansion
author: Jacob N
hidden: false
---
```

#### Adding recipes

Similar to markdown posts, we serve markdown recipes at `src/lib/posts/recipes` as a FITE cookbook at `/fite/recipes`. In addition to the ones on a post, extra frontmatter properties are available for recipes. 

```yaml
---
title: Jay's Red Beans And Rice
source: https://docs.google.com/document/d/1FLn0jF6KJLsfWypjEu3w81kdl8Nu7P61HTMqpZvliyE/edit?usp=drive_link
difficulty: easy
cookTime: 3.5-4 hrs
description: Jay's tried and true red beans and rice. 
feeds: 50
---
```

### Adding images

Put any images you want to add in `src/lib/images`. To make the page more performant, we use [SvelteKit enhanced images](https://svelte.dev/docs/kit/images#sveltejs-enhanced-img). You don't have to do this, but it helps, especially if you're using images directly in a `.svelte` file. See `src/routes/about/+page.svelte` for an example of this. 

If you're adding images directly inside markdown, it seems we can't use enhanced images there, so you'd do it the "old fashioned way" instead. Add your images to `src/static/images` and reference them in markdown as `/images/my-image.jpg`.

### Changing styles

The base stylesheet is at `src/app.css`. We are using [tailwindcss](https://tailwindcss.com/docs/styling-with-utility-classes) and have expressed the DSA Design Palette as `src/DSATheme.css`.

However, you don't have to use Tailwind. Regular CSS will work fine, too.

## For developers

See `HACKING.md` for details. 

### Installation

## Original NTC site template

Here's a link to the NTC template we used to use

https://github.com/dsa-ntc/dsa-chapter-website.github.io
