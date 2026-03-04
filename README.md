<!-- omit from toc -->
# Baton Rouge DSA website

![dsa header](./src/lib/images/Header_ABetterWorld_Louisiana.jpeg)

## Customizing the website

You can edit the site using the online GitHub editor, but this is more suited to minor changes like adding posts/recipes, typos / text adjustments, adding links, etc. Cloning the repo to develop locally is recommended for any substantial changes.

### Adding pages

To add new pages (eg. `/about`, `/get-involved`), add a folder under `src/routes` and create a `+page.svelte` file there. Consider copying and editing an existing page to make this process easier. 

### Adding posts

Markdown files under `src/lib/posts` will be served as independent pages under the `/blog/[slug]` route. There are a few ways to submit a post:

| Method | Best for |
|---|---|
| **Email** [contact@brdsa.org](mailto:contact@brdsa.org) | Anyone — just send your text and a maintainer will handle publishing |
| **GitHub issue** ([post submission template](https://github.com/dsa-ntc/brdsa.github.io/issues/new?template=post-submission.yml)) | If you have a GitHub account but don't want to deal with files or branches |
| **GitHub web editor** | If you're comfortable with GitHub and want to submit a pull request directly |
| **Local development** | For contributors who want to preview changes before submitting (see `HACKING.md`) |

#### Filename convention

Name your file `YYYY-MM-DD-your-title.md` (e.g. `2026-04-15-may-day-march.md`). The full filename (without `.md`) becomes the URL slug, so this example would be served at `/blog/2026-04-15-may-day-march`. Post sort order in the listing is controlled by the `date` frontmatter field, not the filename.

#### Adding a post via the GitHub web editor

1. Go to [`src/lib/posts/`](https://github.com/dsa-ntc/brdsa.github.io/tree/main/src/lib/posts) in the repository.
2. Click **Add file → Create new file**.
3. Name the file following the convention above.
4. Paste in frontmatter (see below) followed by your post body in [Markdown](https://www.markdownguide.org/basic-syntax/).
5. Scroll down to **Commit changes**, select **Create a new branch**, give the branch a name like `post/may-day-march`, and click **Propose changes**.
6. Open the pull request. A maintainer will review and merge it.

If you want to add an image, see [Adding images to a post](#adding-images-to-a-post) below before committing.

#### Frontmatter reference

Every post starts with a YAML frontmatter block between `---` lines. `title` is the only required field; the rest are optional but recommended.

| Field | Required | Description |
|---|---|---|
| `title` | **Yes** | Displayed as the page heading and in post listings |
| `date` | Recommended | ISO date (`YYYY-MM-DD`); controls sort order in `/blog` |
| `description` | Recommended | 1–2 sentences shown in post listings and social/SEO previews |
| `author` | Recommended | Display name(s) |
| `imageUrl` | Optional | Filename only (e.g. `my-photo.jpg`); file must be in `src/lib/images/` (gets enhanced processing) |
| `imageDescription` | Required if `imageUrl` is set | Alt text — describe what is in the image for screen readers |
| `hidden` | Optional | Set to `true` to hide the post from `/blog` (useful for drafts) |
| `slug` | Optional | Override the URL slug; defaults to the full filename without `.md` |
| `tags` | Optional | Array of tags, e.g. `["labor", "housing"]` |

#### Complete example

```markdown
---
title: May Day March 2026
date: 2026-05-01
description: Join us on the streets for International Workers Day. Details inside.
imageUrl: may-day-2026.jpg
imageDescription: A crowd marching with red DSA flags on a sunny street
author: Jane D.
---

Join us this May Day as we take to the streets to seize the means of production and distribution...
```

#### Adding images to a post

There are two ways to include images in a post, and they use different folders:

**Header image (`imageUrl` frontmatter)** — place the file in `src/lib/images/`. The post layout loads it through the SvelteKit enhanced image pipeline, so it gets converted to modern formats and resized automatically. Only the filename goes in the frontmatter:

```yaml
imageUrl: may-day-2026.jpg
imageDescription: A crowd marching with red DSA flags on a sunny street
```

**Inline images in the post body** — place the file in `src/static/images/` and reference it with a root-relative path in your markdown:

```markdown
![A crowd marching with red flags](/images/may-day-2026.jpg)
```

These are served as plain static files with no processing. To upload via the GitHub web editor, navigate to the appropriate folder, click **Add file → Upload files**, then reference the file as shown above.

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

There are two places to put images, and which one you use depends on how the image will be referenced.

#### `src/lib/images/` — enhanced images for `.svelte` files

Images here are processed by Vite at build time: they get converted to modern formats (avif, webp) and resized for different screens. This is good for performance but requires importing the image in a `.svelte` file.

```svelte
<script>
  import hero from "$lib/images/my-photo.jpg?enhanced";
</script>

<enhanced:img src={hero} alt="Description of the photo" />
```

See [src/routes/about/+page.svelte](src/routes/about/+page.svelte) for a working example. These images **cannot** be referenced by URL path — they are bundled by Vite under a hashed filename.

The `imageUrl` frontmatter field on blog posts also uses this path: `+page.ts` loads the image from `src/lib/images/` using the same enhanced glob, so header images on posts get full optimization even though they're specified in markdown frontmatter.

#### `src/static/images/` — plain static assets

Images here are served as-is at `/images/filename.jpg` with no processing. Use this for:

- Images in markdown posts (mdsvex runs before Vite's image pipeline, so enhanced images don't work there)
- CSS `background-image: url(...)` references
- Any image that needs a stable, predictable URL

```markdown
![Description of the photo](/images/my-photo.jpg)
```

The favicon, `robots.txt`, and similar files live in `src/static/` (not `src/static/images/`) for the same reason — they need to be at a known URL path.

### Changing styles

The base stylesheet is at `src/app.css`. We are using [tailwindcss](https://tailwindcss.com/docs/styling-with-utility-classes) and have expressed the DSA Design Palette as `src/DSATheme.css`.

However, you don't have to use Tailwind. Regular CSS will work fine, too.

## For developers

See `HACKING.md` for details. 

### Installation

## Original NTC site template

Here's a link to the NTC template we used to use

https://github.com/dsa-ntc/dsa-chapter-website.github.io
