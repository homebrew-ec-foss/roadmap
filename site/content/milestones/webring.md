---
title: "Webring"
date: "2026-09-10"
description: "Webring is the collection of FOSS communities and sites deticated to open source software"
previewimage: "/images/fireside.jpg"
layout: "milestone"
collections:

 - milestones
---
# What is Webring?
A webring is a collection of websites linked together in a circular structure, allowing visitors to navigate from one site to the next. It's a way to discover and explore related communities and projects.

## Sites in the Ring
- **[Homebrew FOSS](https://homebrew.hsp-ec.xyz/)**
- **[HSP PESUECC](https://hsp-pesuecc.xyz/)**
- **[Nathan's internet home](https://polarhive.net/)**
- **[Hemanth's Internet Home](https://hemanthandey.dev/)**
- **[Aditya's webpage](https://adihegde.com/)**
- **[Anshul's site](https://anshulparuchuri.netlify.app/)**
- **[Pranav's internet home](https://prawns.dev/)**
- **[Pranav's site](https://prana-vvb.github.io/)**

## Want to Join the Webring?
To add your site to the Homebrew Webring, please:
1. Make sure your site focuses on tech, knowledge sharing and open source technologies
2. Add the webring navigation links to your footer
3. **[Open a PR](https://github.com/homebrew-foss/homebrew-internethome)** to request inclusion

Here's a snippet you can add to your footer HTML:
```html
<div class="webring-section">
  <div class="webring-header">
    <h3><a href="https://homebrew.hsp-ec.xyz/webring">Homebrew Webring</a></h3>
  </div>
  <div class="webring-nav">
    <a href="https://homebrew.hsp-ec.xyz/ring/prev?site=YOUR_SITE_URL" class="webring-link">← Previous</a>
    <a href="https://homebrew.hsp-ec.xyz/ring/random?site=YOUR_SITE_URL" class="webring-link">🔀 Random</a>
    <a href="https://homebrew.hsp-ec.xyz/ring/next?site=YOUR_SITE_URL" class="webring-link">Next →</a>
  </div>
</div>
```

Replace `YOUR_SITE_URL` with your actual site URL (e.g. `https://example.com/`).

The webring helps create a community of like-minded developers and enthusiasts sharing their knowledge and passion for open source.
