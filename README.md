<h1 align="center"><a href="https://helvetikon.org">Helvetikon [In Development]</a></h1> 
<p align="center">A crowdsourced dictionary for the swiss german language</p>
<h4 align="center"><a href="https://noahsalvi.notion.site/8cfe2577e735497da32e5108c95717f8?v=060ee05f640d4cb4aa589d4ef8f200f3"> Roadmap (Notion) </a></h4>


<hr>
<!-- <p align="center"><a href="docs/screenshots.md">Screenshots</a> &bull; <a href="https://github.com/varbhat/exatorrent/releases/latest">Releases</a> &bull; <a href="#features">Features</a> &bull; <a href="#installation"> Installation </a> &bull; <a href="docs/usage.md"> Usage</a> &bull; <a href="docs/docker.md">Docker</a> &bull; <a href="docs/build.md"> Build </a> &bull; <a href="LICENSE">License</a></p>
<hr> -->


## Setup

### .env

To set the required environment variables, duplicate `.env.example` and rename it to `.env`.
Fill in the variables as instructed in the file.

### PostgreSQL

A Postgres version 15 instance is required containing the previously specified user and database.

> To enable the database to correctly compare swiss german words, configure `de_CH` or `de-CH-x-icu` 
> to be the database's locale or at least it's `LC_COLLATE` setting.

### FFMPEG

FFMPEG needs to be installed on the server so that the audio samples endpoint can convert audio blobs to mp3.
If you don't want to do that, just don't use the the "add audio sample" feature in DEV :)

## Development

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

- [JWT Authentication](https://stackoverflow.com/a/41250085/13475809)
  This is a slightly different approach to the nomal access and refreshn token approach
- Deployment on VPS
  Helvetikon is hosted on a vps, using OpenLiteSpeed as it's reverse proxy.
  FYI: Cyberpanel was the preferred option but since the current vps only has 512mb RAM it couldn't be installed.
