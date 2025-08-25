---
title: SvelteKit Migration Proposal
date: 2025-08-10
description: This is a proposal for migrating the BRDSA site from Jekyll to SvelteKit.
hidden: true
author: Alex W
---

<script>
    import LightHouseScores from '$lib/components/LightHouseScores.svelte'
</script>

- [What's this about?](#whats-this-about)
- [Why do this?](#why-do-this)
- [Technical details](#technical-details)
  - [Why SvelteKit specifically?](#why-sveltekit-specifically)
  - [Data](#data)

## What's this about?

This is a proposal / proof of concept for migrating the brdsa.org website from its current site generator [Jekyll](https://jekyllrb.com/), to a new one called [SvelteKit](https://svelte.dev/docs/kit/introduction#What-is-SvelteKit).

## Why do this?

Changing a framework like this is usually something you'd want to avoid unless you had good reasons. Jekyll is a great tool because it makes it easy to quickly generate static sites. It's been around for a long time, has lots of community support online, and a low barrier to entry. So why go through the trouble of this? Personally, I wanted to do it for fun, but there are some other reasons that are worth considering.

Our current site currently uses a Jekyll template prepared by NTC. This is functional, but it has a few rough edges. One being the [lone-wolf](https://github.com/manid2/lone-wolf-theme) base theme that the template itself inherits from. Our current setup tells Jekyll to treat lone-wolf as a remote theme, and we build on top of it. The lone-wolf GitHub activity suggests it's no longer actively developed. We've come across this somewhat recently [when we needed to update some socials icons](https://github.com/dsa-ntc/brdsa.github.io/pull/15).

Shy of changing the framework we could 
- fork lone-wolf, change it, and inherit from that
- find some other remote theme to inherit from
- don't use a remote theme and just improve the current stuff

But, for all that work, I figured we might as well just rebuild it with something more powerful and retain the assets that we like. 

pros 
- we can continue to build with a GitHub action and host on GitHub Pages (or use virtually any other host)
- we can retain all our existing Markdown pages, and continue using Markdown to add content 
- the Svelte syntax is very similar to HTML and Jekyll syntax, so it's easy to transition
- it's an opportunity to make our site more distinctive. sites built with Svelte feel super fast.
- (opinion) it's easier to develop. the tooling is nice. the docs are nice.
cons
- Svelte uses some file extensions that might be offputting for folks that want to contribute
- SvelteKit itself has an opinionated project structure that some may not like
- Jekyll was designed specifically for static site generation, Svelte was not
- the SvelteKit was more complex to set up; however, once things are set up it's easy to copy/paste styles from existing pages

Additionally, the site built with SvelteKit is [measurably more performant and accessible](#data) than the one built with Jekyll.

## Technical details

Below are some additional technical details and some data that shows the performance improvement of the SvelteKit build.

### Why SvelteKit specifically? 

[Svelte](https://svelte.dev/docs/svelte/overview) is a JavaScript library for creating UIs, and SvelteKit is a webserver tailored to serving Svelte apps.
SvelteKit can also be used as a static site generator, which is what Jekyll is and what we want it for. 

Our website is a static site -- just some files sitting on a server without any dynamic content from a database like a comments section. The parts that are dynamic, like the donate widget and so on, are served through <code>iframe</code>s which act kind of like windows into a different website.

More to the point, because SvelteKit excels at pre-prendering pages for optimal load times and SEO performance, all those benefits apply to using it as a static site generator. Static sites are great because they can usually be hosted for free or cheaply. Our current (free) webhost, [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), requires that we produce a static build. 

Svelte itself as a UI library has a really robust component model -- basically we can design a few rich elements or layouts and reuse them easily. For anything but trivial HTML layouts, this is essential. Additionally, through community libraries such as [mdsvex](https://mdsvex.pngwn.io/) we can easily take advantage of using Markdown for writing content. In combination, we get to design beautiful and responsive UI using Svelte, and do the bulk of our copy/prose/post authoring in easy-breezy Markdown. We can also add interactive Svelte components directly to our markdown, such as the animated graph below.

### Data

As part of the project I thought it would make sense to gather some data to help motivate the change. The results indicate that the SvelteKit build is generally more performant than the Jekyll build. 

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) is an open source tool maintained by Google that is commonly used to generate metrics of page health. It measures across four core categories: accessibility, performance, best practices, and SEO friendliness. 

Here's some plots of Lighthouse scores of the BRDSA site before and after conversion to SvelteKit. The new build is better or equivalent on all pages but one. Our banger portrait of Ella baker on the [Get Involved](/get-involved) page is lower resolution than Lighthouse would like, and so that page's score got dinged. Alas. 

<LightHouseScores/>

**Accessibility** can be difficult to achieve, but tends to involve a combination of using semantically correct HTML and added hints for screen readers in the from of [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) tags. To go a step further, we also used a [constrast checker tool](https://webaim.org/resources/contrastchecker/) to make sure all our text meets some minimum legibility standards.

**Performance** is especially important for mobile devices, but also good for general sustainability. This is generally achieved by not loading more static assets than necessary (images, CSS styles, JavaScript).

**Best practices** is somewhat more vaguely defined, but tends to involve using semantically correct HTML and using secure cookie features, etc. 

Also somewhat vaguely defined, **SEO** involves using descriptive meta tags, serving a sitemap file, etc. and generally making the site friendly to link crawlers.  

The script used to generate these scores is kept in the project, so it'll be easy for future maintainers to keep an eye on these metrics as well. 
