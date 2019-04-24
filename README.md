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

<table>

<tbody><tr><th>

<h2 align=center>Changes</h2>

</th></tr><tr><td>

`0.0.0-alpha.4` Using all-markout links (ie `/markout/#/…`)

</td></tr><tr><td>

`0.0.0-alpha.3` Using flat structure with `http-server` proxy

</td></tr><tr><td>

`0.0.0-alpha.2` Using `yarn` workspaces to `../`

</td></tr><tr><td>

`0.0.0-alpha.0` Using symbolic links to `node_moudles/@smotaal`

</td></tr>

</tbody>

<tr><td hidden></td></tr>

<tbody><tr><th>

<h2>
<div>Development<div>
<sub>

Using `npx` without dependencies

</sub>
</h2>

</th></tr><tr><td>

<blockquote>

This option is ideal for troubleshooting or local hacking using the `?dev` query to force loading from `…/lib/` folders where you can make all kinds of changes directly at a source level.

</blockquote>

1. Clone the repo locally
2. Clone other repo(s) you need into their respective folder
3. Run `npm start` or `npx http-server --cors -s -P https://www.smotaal.io/`

</td></tr></tbody>

<tr><td hidden></td></tr>

<tbody><tr><th>

<h2>
<div>Development<div>
<sub>

Using `npm` or `yarn` with dependencies

</sub>
</h2>

</th></tr><tr><td>

<blockquote>

This option is **required** if you will be updating any of the bundles in the `…/dist/` folders by running `yarn workspace @smotaal/‹workspace› bundle`.

</blockquote>

1. Clone the repo locally
2. Clone other repo(s) if applicable into ./packages
3. Run `npm run relink`.
4. Run `npm install` or `yarn`.
5. Run `npm run serve` or `yarn http-server --cors -s -P https://www.smotaal.io/`.

<!-- # **[`smotaal.io`](./)** [<kbd>github</kbd>](https://github.com/SMotaal/smotaal.github.io/ 'SMotaal/smotaal.github.io') -->

</td></tr></table>

</div>
