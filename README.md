<h1 align="center"><a href="https://helvetikon.org">Helvetikon</a></h1> 
<p align="center">A community maintained dictionary for the swiss german language</p>

<hr>
<!-- <p align="center"><a href="docs/screenshots.md">Screenshots</a> &bull; <a href="https://github.com/varbhat/exatorrent/releases/latest">Releases</a> &bull; <a href="#features">Features</a> &bull; <a href="#installation"> Installation </a> &bull; <a href="docs/usage.md"> Usage</a> &bull; <a href="docs/docker.md">Docker</a> &bull; <a href="docs/build.md"> Build </a> &bull; <a href="LICENSE">License</a></p>
<hr> -->

## Developing

This project uses [yarn](https://classic.yarnpkg.com/en/docs/install) instead of npm as the package manager.

Install project dependencies

```bash
yarn install
```

Start development server

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To build and run the production version of the app.

```bash
yarn build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

And to run the nodejs app

```bash
node build/
```

## Resources

- [Deployment on VPS](https://www.youtube.com/watch?v=oykl1Ih9pMg&t=793s)
- [Hosting Mail Server on VPS](https://www.youtube.com/watch?v=9zP7qooM4pY)
