<!-- omit from toc -->

# Baton Rouge DSA website

![dsa header](./src/lib/images/Header_ABetterWorld_Louisiana.jpeg)

This is the source for [brdsa.org](https://brdsa.org). If you want to submit a
post or fix some text, everything you need is on this page. If you want to work
on the site itself, see [HACKING.md](HACKING.md).

## Submitting a post

Markdown files under `src/lib/posts` are served as their own pages under
`/blog/[slug]`. There are a few ways to get a post published:

| Method                                                                                                                            | Best for                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Email** [contact@brdsa.org](mailto:contact@brdsa.org)                                                                           | Anyone. Send your text and a maintainer will handle publishing                  |
| **GitHub issue** ([post submission template](https://github.com/dsa-ntc/brdsa.github.io/issues/new?template=post-submission.yml)) | If you have a GitHub account but don't want to deal with files or branches      |
| **GitHub web editor**                                                                                                             | If you're comfortable with GitHub and want to submit a pull request directly    |
| **Local development**                                                                                                             | If you want to preview changes before submitting (see [HACKING.md](HACKING.md)) |

You do not need to install anything to write for the site. The GitHub web
editor is fine for posts, typo fixes, and link changes.

### Filename convention

Name your file `YYYY-MM-DD-your-title.md`, for example
`2026-04-15-may-day-march.md`. The full filename without `.md` becomes the URL
slug, so that example is served at `/blog/2026-04-15-may-day-march`. Sort order
in the post listing comes from the `date` frontmatter field, not the filename.

### Adding a post via the GitHub web editor

1. Go to [`src/lib/posts/`](https://github.com/dsa-ntc/brdsa.github.io/tree/main/src/lib/posts) in the repository.
2. Click **Add file → Create new file**.
3. Name the file following the convention above.
4. Paste in frontmatter (see below) followed by your post body in [Markdown](https://www.markdownguide.org/basic-syntax/).
5. Scroll down to **Commit changes**, select **Create a new branch**, give the branch a name like `post/may-day-march`, and click **Propose changes**.
6. Open the pull request. A maintainer will review and merge it.

If your post has an image, read [Images in a post](#images-in-a-post) before you
commit.

### Frontmatter reference

Every post starts with a YAML frontmatter block between `---` lines. `title` is
the only required field; the rest are optional but recommended.

| Field              | Required                      | Description                                                           |
| ------------------ | ----------------------------- | --------------------------------------------------------------------- |
| `title`            | **Yes**                       | Displayed as the page heading and in post listings                    |
| `date`             | Recommended                   | ISO date (`YYYY-MM-DD`), controls sort order in `/blog`               |
| `description`      | Recommended                   | 1-2 sentences shown in post listings and social/SEO previews          |
| `author`           | Recommended                   | Display name(s)                                                       |
| `imageUrl`         | Optional                      | Filename only, e.g. `my-photo.jpg`. File must be in `src/lib/images/` |
| `imageDescription` | Required if `imageUrl` is set | Alt text. Describe what is in the image for screen readers            |
| `hidden`           | Optional                      | Set to `true` to hide the post from `/blog`, useful for drafts        |
| `slug`             | Optional                      | Override the URL slug. Defaults to the full filename without `.md`    |
| `tags`             | Optional                      | Array of tags, e.g. `["labor", "housing"]`                            |

### Complete example

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

## Writing the post body

### Links

**Always use plain Markdown links**, `[text](https://example.com)`. Never write
a raw `<a href="..." target="_blank">` tag. The build adds
`target="_blank" rel="noopener noreferrer"` to every external link
automatically, so writing the tag by hand only duplicates what already happens.

**When you link to another page on our own site, use an internal link**, a
root-relative path like `[get involved](/get-involved)` or
`[our statements](/blog)`, _not_ the full `https://brdsa.org/...` URL. Internal
links are deliberately left alone by the build so they open in the same tab
instead of spawning a new one, and they keep working if the domain ever
changes. Pasting the full URL to our own site still works, since it is detected
and treated as internal, but the short form is what we want in posts.

Common internal paths: `/blog`, `/about`, `/campaigns`, `/get-involved`,
`/donate`, `/bylaws`.

### Citations and footnotes

Use footnote syntax rather than hand-numbered `<sup>` and `<ol>` markup:

```markdown
Immigrants report abuse in detention.[^1] The hunger strike continues.[^2]

[^1]: [Complaints allege abuse at Louisiana ICE facility](https://lailluminator.com/2025/09/19/ice-abuse-louisiana/)

[^2]: Plain text works too, a link is not required.
```

Numbering is automatic and follows the order the footnotes are _referenced_, so
you can insert a new citation anywhere without renumbering anything. Reusing the
same `[^1]` twice points at one shared note. Stacked citations like `[^1][^2]`
work. The labels are just identifiers, so `[^basile]` reads better than `[^1]`
in a long post and comes out numbered the same way. Definitions can live
anywhere in the file, but by convention they go at the bottom.

Do **not** add your own `## References` heading. The footnote list is generated
for you.

Tables and `~~strikethrough~~` are available too.

Need to build a citation? [zbib.org](https://zbib.org/) is handy.

### Images in a post

There are two ways to include an image, and they use different folders.

**Header image**, set with the `imageUrl` frontmatter field. Put the file in
`src/lib/images/` and use only the filename:

```yaml
imageUrl: may-day-2026.jpg
imageDescription: A crowd marching with red DSA flags on a sunny street
```

These get resized and converted to modern formats automatically.

**Inline images in the post body**. Put the file in `static/images/` and
reference it with a root-relative path:

```markdown
![A crowd marching with red flags](/images/may-day-2026.jpg)
```

Inline images are served as plain files with no processing. This folder is
separate from the header image folder on purpose; see
[Images](HACKING.md#images) in HACKING.md for why.

To upload either kind through the GitHub web editor, navigate to the folder,
click **Add file → Upload files**, then reference the file as shown above.

## Submitting a recipe

Recipes work like posts. Markdown files under `src/lib/posts/recipes` are served
as a FITE cookbook at `/fite/recipes`. Recipes support the post frontmatter
fields plus a few of their own:

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

## Working on the site itself

Adding pages, changing styles, and anything touching the build is covered in
[HACKING.md](HACKING.md).

## Original NTC site template

Here's a link to the NTC template we used to use:

https://github.com/dsa-ntc/dsa-chapter-website.github.io
