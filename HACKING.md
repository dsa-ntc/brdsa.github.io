# Dev notes

prereqs:
- node.js
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
  - `posts` holds all the copy in the form of markdown files
    - we can freely reuse pieces of text from here around the site
  - `routes` is where we define parts of the site by their URL. this is the most Svelte specific part of the project
    - basically each folder you make under here is a route, and by convention the files always have the same names like `+page.svelte`
    - so we have folders for some important pages that should have their own URL like `brdsa.org/about` or `brdsa.org/donate`
    - `blog/[slug]` is a dynamic route that serves all the other content that we don't want to have to explicitly define
      - `[slug]` is the next URL segment as defined in the Markdown file's frontmatter `slug` property
      - the code in 
- `static` is just static stuff that should be served at the site root. `robots.txt`, `favicon.ico` etc.


### GitHub workflow

Copied and modified this person's GH workflow, updated the Node version I think?
https://github.com/khromov/derivault/blob/main/.github/workflows/build.yml

see `.github/deploy.yml`.

### Setting up the blog route

I actually struggled with this a fair bit at first, but it's working now. I don't fully understand some of the more detailed points about JavaScript module loading. The list of posts is served from /api/posts. See postUtils.ts for module loading specifics. Much of the code there was adapted from articles linked below.

### If there's a weird problem

especially if you're getting a weird type error that seems wrong, give a shot just reloading vscode `ctrl shift p` then `developer: reload window`. occassionally the type cache is bad

### Quirks with images

for main content included in a page, we use `enhanced:img` wherever possible, including with a hero image optionall specified in the frontmatter of blog posts. however, it s

### Quirks with Apache

On moving to MFM hosting, we ran into an issue with our build output not matching the directory structure that Apache expects. We fixed that by enabling this https://svelte.dev/docs/kit/page-options#trailingSlash

### Useful links

https://git-scm.com/downloads/win

https://www.markdownguide.org/basic-syntax/#reference-style-links

action network css examples
https://help.actionnetwork.org/hc/en-us/articles/115005729066-CSS-snippets-for-embed-customization

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


### credits

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
