# Dev notes

This covers working on the site itself. If you just want to submit a post or
edit some text, see [README.md](README.md) instead; you don't need any of this.

prereqs:

- node.js (version 24, see [Tooling with mise](#tooling-with-mise))
- an editor (preferably VSCode)
  - open the workspace file to use its settings. it makes the file explorer easier to use
  - installing some of the recommended plugins is optional, but get Svelte and TailWind at least
  - the markdown all in one plugin is nice too
- a GitHub account
- git [windows download](https://git-scm.com/downloads/win)

## Cloning the repo

```
git clone https://github.com/dsa-ntc/brdsa.github.io.git
```

or using the [GitHub CLI](https://cli.github.com/) (it's nice)

```
gh repo clone dsa-ntc/brdsa.github.io
```

Install the dependencies with

```
npm install
```

Run the app

```
npm run dev -- --open
```

Build and preview the app

```
npm run build && npm run preview -- --open
```

Run the Lighthouse tests. Edit URLs to test in `lighthouse.js`.

```
npm run test:lighthouse
```

VSCode is not required, but highly recommended. The suggested settings in `.vscode/settings.json` and `.vscode/extensions.json` were tailored for this project, but are not required. For basic changes or working with Markdown, the online GitHub text editor is probably fine, too.

There shouldn't be too much need for interacting with the TypeScript files, besides maybe `/src/lib/config.ts`.

## Tooling with mise

[mise](https://mise.jdx.dev/) is optional for everyday work, but it's how we pin
tool versions. The config is `mise.toml`:

```toml
[tools]
node = "24"
jq = "latest"

[env]
_.file = '.env'
```

It does two things for us.

**Pins the toolchain.** With mise installed, `cd`ing into the repo puts Node 24
and `jq` on your PATH, whatever you happen to have installed globally. Node 24
is what the deploy workflow builds with, so matching it locally avoids the class
of bug where a build passes on your machine and fails in CI. `jq` is only used
by the deploy scripts.

**Loads `.env`.** The `_.file` line exports whatever is in your local `.env`
into the shell. That file holds the `MFM_*` deploy credentials used by the
scripts in `scripts/`, so you don't have to export six variables by hand every
session. See [scripts/README.md](scripts/README.md) for how to use them, and
`.env.example` for the template. `.env` itself is gitignored, so real
credentials never get committed.

Note there are no mise tasks defined. Builds and checks stay in npm scripts
(`npm run dev`, `npm run build`, `npm run lint`), and those all work fine
without mise as long as you're on a recent enough Node.

### No pre-commit hooks

We don't install git hooks, so nothing runs automatically when you commit.
Formatting and linting are checked when you open a PR. To catch problems before
pushing, run them yourself:

```
npm run lint
npm run check
```

`npm run lint` runs Prettier in check mode plus ESLint. `npm run format` fixes
formatting in place. `npm run check` runs `svelte-check` for type errors.

## Project structure

Here's the docs for the [Svelte markup syntax](https://svelte.dev/docs/svelte/basic-markup).
SvelteKit (the thing that builds our Svelte code into a website) has some strong opinions about the [project layout](https://svelte.dev/docs/kit/project-structure).

They may seem weird at first, but they're nice once they click.

- `src` has the main code
  - `app.html` is the root document, and our content gets injected in there
  - `app.css` is the root stylesheet
  - `lib` holds some TypeScript files that the site uses
    - `config.ts` has some settings that affect the site, like it's title, a list of nav links to show in the header, etc.
    - `types.ts` has a type definition in it called `PostMetadata` which is what the site expects to show up in the frontmatter of Markdown content
    - `images` holds images that get optimized at build time, see [Images](#images)
  - `posts` holds all the copy in the form of markdown files
    - we can freely reuse pieces of text from here around the site
  - `routes` is where we define parts of the site by their URL. this is the most Svelte specific part of the project
    - basically each folder you make under here is a route, and by convention the files always have the same names like `+page.svelte`
    - so we have folders for some important pages that should have their own URL like `brdsa.org/about` or `brdsa.org/donate`
    - `blog/[slug]` is a dynamic route that serves all the other content that we don't want to have to explicitly define
      - `[slug]` is the next URL segment as defined in the Markdown file's frontmatter `slug` property
- `static` is served at the site root as-is. `robots.txt`, `favicon.ico`, `images/`, `fonts/` etc.
- `plugins` holds our custom markdown build plugins
- `scripts` holds the deploy scripts, see [scripts/README.md](scripts/README.md)

## Adding pages

To add a new page (eg. `/about`, `/get-involved`), add a folder under
`src/routes` and create a `+page.svelte` file in it. Copying and editing an
existing page is usually the easiest way to start.

## Changing styles

The base stylesheet is at `src/app.css`. We are using
[tailwindcss](https://tailwindcss.com/docs/styling-with-utility-classes) and
have expressed the DSA Design Palette as `src/DSATheme.css`.

You don't have to use Tailwind, though. Regular CSS works fine too.

## Images

There are two places to put images, and which one you use depends on how the
image gets referenced.

### `src/lib/images/`, optimized images

Images here are processed by Vite at build time. They get converted to modern
formats (avif, webp) and resized for different screens. Good for performance,
but it requires importing the image in a `.svelte` file:

```svelte
<script>
  import hero from "$lib/images/my-photo.jpg?enhanced";
</script>

<enhanced:img src={hero} alt="Description of the photo" />
```

See [src/routes/about/+page.svelte](src/routes/about/+page.svelte) for a working
example. These images **cannot** be referenced by URL path, since Vite bundles
them under a hashed filename.

The `imageUrl` frontmatter field on blog posts also uses this folder. `+page.ts`
loads the image through the same enhanced glob, so post header images get full
optimization even though they're named in markdown frontmatter.

### `static/images/`, plain static assets

Images here are served as-is at `/images/filename.jpg` with no processing. Use
this for:

- images in markdown posts
- CSS `background-image: url(...)` references
- any image that needs a stable, predictable URL

```markdown
![Description of the photo](/images/my-photo.jpg)
```

The favicon, `robots.txt` and similar files live directly in `static/` for the
same reason; they need to sit at a known URL path.

### Why markdown posts can't use optimized images

`enhanced:img` does not work inside markdown files. mdsvex processes the
markdown before SvelteKit's image pipeline runs, so the enhanced image
transforms never get applied. That's why inline post images have to go in
`static/images/` and use a root-relative path.

## Markdown build pipeline

Posts are processed by [mdsvex](https://mdsvex.pngwn.io/), configured in
`svelte.config.js`. A few plugins run over every markdown file:

- `rehypeSlug` and `rehypeAutolinkHeadings` give headings anchor links
- `rehypeExternalLinks` adds `target="_blank" rel="noopener noreferrer"` to
  external links. Links to our own host and root-relative links are excluded on
  purpose, so they open in the same tab
- `remarkGfm` provides tables and strikethrough
- `remarkFootnotes` (`plugins/remark-footnotes.js`) provides `[^1]` footnotes

Writer-facing guidance for all of this lives in
[README.md](README.md#writing-the-post-body).

### Why we have a custom footnote plugin

`remark-gfm` normally handles footnotes, but not here. mdsvex 0.12 vendors a
pre-remark-13 parser using the legacy `blockTokenizers`/`inlineTokenizers` API,
while `remark-gfm` targets the modern micromark API. Tables and strikethrough
happen to survive that mismatch; footnotes do not, and `[^1]` renders as literal
text. mdsvex exposes no option to turn on its own vendored footnote tokenizer
either. Still true as of mdsvex 0.12.8.

Worth knowing: the vendored parser handles tables and strikethrough by itself,
so `remark-gfm` is not actually what gives us those.

This is a known upstream problem rather than anything specific to our setup.
See [#374](https://github.com/pngwn/MDsveX/issues/374) (closed with a
workaround), [#511](https://github.com/pngwn/MDsveX/issues/511) (open, people
still hitting it), and
[discussion #236](https://github.com/pngwn/MDsveX/discussions/236) for the
maintainer's summary.

The usual workaround is to pin `remark-footnotes@2.0.0`, the last pre-micromark
release, and it does work. We don't use it because it renders the raw label
rather than a number, so `[^basile]` would display as a superscript reading
"basile" instead of "1", and because that package is deprecated upstream. Our
posts came from hand-numbered reference lists and need real sequential
numbering, which `plugins/remark-footnotes.js` does by counting order of first
reference.

That file reconstructs footnotes from the mdast the legacy parser does produce,
and has a longer comment explaining the node shapes involved.

The maintainer is currently writing a from-scratch replacement parser in
`packages/parse`. It isn't published yet and has no footnote support today.
Once mdsvex ships it, this plugin can be dropped in favor of plain
`remark-gfm`.

## GitHub workflow

Copied and modified this person's GH workflow, updated the Node version I think?
https://github.com/khromov/derivault/blob/main/.github/workflows/build.yml

See `.github/workflows/deploy.yml`. It builds on push to `main` and copies the
output to the MFM server over SCP.

The workflow gets its tool versions from `mise.toml` via `jdx/mise-action`,
rather than restating the Node version in the workflow file. That way
`mise.toml` is the single place the Node version is set, and local dev and CI
can't drift apart. If you bump Node, bump it there.

Credentials come from GitHub repo `vars` and `secrets` in CI, which are the same
values the local deploy scripts read from `.env`.

https://help.mayfirst.org/en/guide/how-to-automate-ssh-access

### Opening a pull request

Once your changes are on a branch, open a pull request (PR) against `main`. The CI workflow will automatically build the site and run checks. A maintainer will review and merge when it looks good.

For content-only changes (new posts, text edits) you don't need local dev at all. The GitHub web editor is fine. For structural changes (new routes, component edits, dependency updates) it's worth running `npm run build` locally first to catch type errors or build failures before pushing.

## Setting up the blog route

I actually struggled with this a fair bit at first, but it's working now. I don't fully understand some of the more detailed points about JavaScript module loading. The list of posts is served from /api/posts. See postUtils.ts for module loading specifics. Much of the code there was adapted from articles linked below.

## If there's a weird problem

especially if you're getting a weird type error that seems wrong, give a shot just reloading vscode `ctrl shift p` then `developer: reload window`. occassionally the type cache is bad

## Quirks with Apache

On moving to MFM hosting, we ran into an issue with our build output not matching the directory structure that Apache expects. We fixed that by enabling this https://svelte.dev/docs/kit/page-options#trailingSlash

## Useful links

https://git-scm.com/downloads/win

https://www.markdownguide.org/basic-syntax/#reference-style-links

GitHub-flavored Markdown footnote syntax
https://github.blog/changelog/2021-09-30-footnotes-now-supported-in-markdown-fields/

text contrast checker https://webaim.org/resources/contrastchecker/

sveltekit project structure
https://svelte.dev/docs/kit/project-structure

tailwind container query size reference
note that the standard viewport breakpoints `sm`, `md`, `lg`, `xl`, and `2xl` are different lengths from the container query breakpoints `@sm`, `@md`, `@lg`,
https://tailwindcss.com/docs/responsive-design#working-mobile-first
https://tailwindcss.com/docs/responsive-design#container-size-reference

how to debug your code
https://svelte.dev/docs/kit/debugging#Visual-Studio-Code

general guidance for project layout (maybe outdated)
https://joyofcode.xyz/sveltekit-markdown-blog#rendering-a-single-post

some default settings to put in `.vscode`
https://www.sveltepatterns.dev/getting-started-with-vscode

## credits

excellent project setup guides, basic plumbing
https://mli.puffinsystems.com/blog/sveltekit-blog-docs-with-mdsvex
https://github.com/mvasigh/sveltekit-mdsvex-blog/tree/main
https://github.com/josh-collinsworth/sveltekit-blog-starter

phenomenal guide, can probably ditch the mdsvex if it's excessive or causing problems
https://gebna.gg/blog/blog-from-scratch-using-sveltekit

svg icons
https://simpleicons.org/?q=github
https://tabler.io/icons
https://heroicons.com/

underline animation
https://cssf1.com/how-to/create-hover-underline-animation-tailwind-css

details/summary animation
https://www.youtube.com/watch?v=Vzj3jSUbMtI

generating citations

https://zbib.org/
https://asouqi.github.io/bibtex-converter/
