# smotaal.io

Open-source is a notion that has made it so we can all flourish!

## Publishing

- This repo serves directly to www.smotaal.io:

  - ./markout -> www.smotaal.io/markout

- Other repos serve directly serve subfolders to www.smotaal.io:

  - SMotaal/components -> www.smotaal.io/components
  - SMotaal/pholio -> www.smotaal.io/pholio
  - SMotaal/markup -> www.smotaal.io/markup
  - SMotaal/quench -> www.smotaal.io/quench

- Other repos serve directly serve subdomains to smotaal.io:
  - SMotaal/experimental -> experimental.smotaal.io

## Development

**Without `install`**

This mimics closer to reality.

1. Clone the repo locally
2. Clone other repo(s) you need into their respective folder
3. Run `npx http-server --cors -s -P https://www.smotaal.io/`

**With `install`**

This will install node_modules dependencies.

1. Clone the repo locally
2. Clone other repo(s) if applicable into ./packages
3. Run `npm install`
4. Run `npm run relink`
5. Run `npm run serve`

## Changes

- `0.0.0-alpha.3` Using flat structure with `http-server` proxy
- `0.0.0-alpha.2` Using `yarn` workspaces to `../`
- `0.0.0-alpha.0` Using symbolic links to `node_moudles/@smotaal`
