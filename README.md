<div align=center>

# smotaal.io

<h2>

**[<kbd>Components</kbd>](/components/README)**
**[<kbd>Experimental</kbd>](/experimental/README)**
**[<kbd>Markup</kbd>](/markup/README)**
**[<kbd>Markout</kbd>](/markout/README)**
**[<kbd>Meta</kbd>](/meta/README)**
**[<kbd>Pholio</kbd>](/pholio/)**
**[<kbd>Quench</kbd>](/quench/)**

</h2>

<aside>

## Changes

<table>

<tr><td>

`0.0.0-alpha.4` Using all-markout links (ie `/markout/#/…`)

<tr><td>

`0.0.0-alpha.3` Using flat structure with `http-server` proxy

<tr><td>

`0.0.0-alpha.2` Using `yarn` workspaces to `../`

<tr><td>

`0.0.0-alpha.0` Using symbolic links to `node_moudles/@smotaal`

</table>

## Development

<table>
<tr><th>

### Serving locally (using `http-server`)

<tr><td>
<tr><td>

#### A. Using `npx` without dependencies <kbd>recommended</kbd>

<blockquote>

This option is ideal for troubleshooting or local hacking using the `?dev` query to force loading from `…/lib/` folders where you can make all kinds of changes directly at a source level.

</blockquote>

1. Clone the repo locally
2. Clone other repo(s) you need into their respective folder
3. Run `npm start` or `npx http-server --cors -s -P https://www.smotaal.io/`

<tr><td>
<tr><td>

#### B. Using `npm install` or `yarn` with dependencies

<blockquote>

This option is **required** if you will be updating any of the bundles in the `…/dist/` folders by running `yarn workspace @smotaal/‹workspace› bundle`.

</blockquote>

1. Clone the repo locally
2. Clone other repo(s) if applicable into ./packages
3. Run `npm run relink`.
4. Run `npm install` or `yarn`.
5. Run `npm run serve` or `yarn http-server --cors -s -P https://www.smotaal.io/`.

<!-- # **[`smotaal.io`](./)** <span float-right><small>[<kbd>github</kbd>](https://github.com/SMotaal/smotaal.github.io/ 'SMotaal/smotaal.github.io')</small></span> -->

</table>
</aside>

</div>
