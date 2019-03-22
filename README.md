# smotaal.io

## Projects

- **[`smotaal.io`](./)** [<kbd>github</kbd>](https://github.com/SMotaal/smotaal.github.io/ 'SMotaal/smotaal.github.io')

  - **[`components`](/components/README)** [<kbd>github</kbd>](https://github.com/SMotaal/components/ 'SMotaal/components')

  - **`esm`** [<kbd>github</kbd>](https://github.com/SMotaal/esm/ 'SMotaal/esm')

  - **[`experimental`](/experimental/README)** [<kbd>github</kbd>](https://github.com/SMotaal/experimental/ 'SMotaal/experimental')

  - **[`markup`](/markup/)** [<kbd>github</kbd>](https://github.com/SMotaal/markup/ 'SMotaal/markup')

  - **[`markout`](/markout/)** [<kbd>github</kbd>](https://github.com/SMotaal/smotaal.github.io/tree/master/packages/markout/ 'SMotaal/smotaal.github.io')

  - **[`pholio`](/pholio/)** [<kbd>github</kbd>](https://github.com/SMotaal/pholio/ 'SMotaal/pholio')

  - **[`quench`](/quench/)** [<kbd>github</kbd>](https://github.com/SMotaal/quench/ 'SMotaal/quench')

---

## Changes

- `0.0.0-alpha.3` Using flat structure with `http-server` proxy
- `0.0.0-alpha.2` Using `yarn` workspaces to `../`
- `0.0.0-alpha.0` Using symbolic links to `node_moudles/@smotaal`

---

## Development

### Serving locally (using `http-server`)

#### A. Using `npx` without dependencies <kbd>recommended</kbd>

1. Clone the repo locally
2. Clone other repo(s) you need into their respective folder
3. Run `npx http-server --cors -s -P https://www.smotaal.io/`

#### B. Using `npm install` or `yarn` with dependencies

1. Clone the repo locally
2. Clone other repo(s) if applicable into ./packages
3. Run `npm install`
4. Run `npm run relink`
5. Run `npm run serve`
