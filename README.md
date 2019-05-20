<div align=center>

# smotaal.io

<h1>

**[<kbd>Markup</kbd>](/markup/README)**
**[<kbd>Markout</kbd>](/markout/README)**
**[<kbd>Meta</kbd>](/meta/README)**
**[<kbd>Pholio</kbd>](/pholio/)**
**[<kbd>Quench</kbd>](/quench/)**
**[<kbd>Experimental</kbd>](/experimental/ 'Live on the edge!')**

</h1>

<!-- <div align=center style="display: grid; grid-gap: 1em; place-content: space-around;"> -->
<div align=center>

<table width=90%>

<thead><tr><th colspan=2>

### Changes

<tbody>

<tr><th><code>0.0.0-alpha.5</code><td>

- Refactor everything markout (into `/markout/…`)
- Add support for `@media(prefers-color-scheme: dark)`
- Integrate new Matcher-based ECMAScript tokenizer

<tr><th><code>0.0.0-alpha.4</code><td>

- Using all-markout links (ie `/markout/#/…`)

<tr><th><code>0.0.0-alpha.3</code><td>

- Using flat structure with `http-server` proxy

<tr><th><code>0.0.0-alpha.2</code><td>

- Using `yarn` workspaces to `../`

<tr><th><code>0.0.0-alpha.1</code><td>

- Using symbolic links to `node_moudles/@smotaal`

</table>

<table width=90%>

<thead><tr><th>

### Development

<tbody><tr><th>

#### Using `npx` without dependencies

<tr><td>

This option is ideal for troubleshooting or local hacking using the `?dev` query to force loading from `…/lib/` folders where you can make all kinds of changes directly at a source level.

1. Clone the repo locally
2. Clone other repo(s) you need into their respective folder
3. Run `npm start` or `npx http-server --cors -s -P https://www.smotaal.io/`

<tbody><tr><th>

#### Using `npm` or `yarn` with dependencies

<tr><td>

This option is **required** if you will be updating any of the bundles in the `…/dist/` folders by running `yarn workspace @smotaal/‹workspace› bundle`.

1. Clone the repo locally
2. Clone other repo(s) if applicable into ./packages
3. Run `npm run relink`.
4. Run `npm install` or `yarn`.
5. Run `npm run serve` or `yarn http-server --cors -s -P https://www.smotaal.io/`.

</table>

</div>

</div>
