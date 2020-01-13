# Changelog

## [0.0.2][] — `unreleased`

> **Intended Releases**
>
> — `@smotaal.io/rollup@0.0.2`
> — `@smotaal.io/tools@0.0.5`

### Added

- `./helpers.cjs`

  - Minimal `fallbacks` scope map in `rollup.config.json`.

    > Maps `scope` to `https` urls for now.

  - Minimal `load` hook in `Resolver`.

    > Loads scoped fallbacks from `https` only for now.

## [0.0.1][]

> **Intended Releases**
>
> — `@smotaal.io/rollup@0.0.1`
> — `@smotaal.io/tools@0.0.3`

### Added

- `./helpers.cjs`

  - Minimalistic path-friendly `Locator` helper abstraction over `URL`s with its own `filename` property separate from `pathname`.

    > Includes `Symbol.for('nodejs.util.inspect.custom')` for clean `console.log` output in Node.js.

  - Minimalistic path- and scope-friendly `Resolver` helper abstractions.

---

[0.0.2]: https://www.npmjs.com/package/@smotaal.io/rollup/v/0.0.2
[0.0.1]: https://www.npmjs.com/package/@smotaal.io/rollup/v/0.0.1
