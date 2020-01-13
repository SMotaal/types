# Changelog

## [0.0.1][] — `unreleased`

> **Intended Releases**
>
> — `@smotaal.io/rollup@0.0.1`
> — `@smotaal.io/tools@0.0.3`

### Added

- `./helpers.cjs`

  - Minimalistic path-friendly `Locator` helper abstraction over `URL`s with its own `filename` property separate from `pathname`.

    > Includes `Symbol.for('nodejs.util.inspect.custom')` for clean `console.log` output in Node.js.

  - Minimalistic path- and scope-friendly `Resolver` helper abstractions.

  <!-- - Platform-agnostic `require` helper abstractions with a second optional argument for the resolved `referrer` locator (ie with the implicit `file:` scheme or other explicit scheme where supported). -->

---

[0.0.1]: https://www.npmjs.com/package/@smotaal.io/rollup/v/0.0.1
