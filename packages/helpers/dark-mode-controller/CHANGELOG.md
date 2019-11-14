# Change Log

## [0.0.4] - 2019-11-09

### Changed

- Updated `homepage` to point to `master` branch — `staging` is no longer used.

## [0.0.3] - 2019-11-09

### Added

- Helper `@smotaal.io/browser/dark-mode.js`.

### Fixed

- Auto-toggling failing due to bad matching expressions.

### Meta

**Development Only**

- Added `tsc` and `rollup` as `devDependencies` in `tasks.
- Added internal helper bundle for `smotaal.io/browser/dark-mode.js`.
- Added internal helper bundle for `smotaal.io/browser/dark-mode.js`.

---

> **Important Note** — Starting from 0.0.2 publishing switched from GPR `@smotaal/dark-mode-controller` to NPM `@smotaal.io/dark-mode-controller`

---

## [0.0.2] - 2019-11-07

### Added

- CommonJS nested package in `@smotaal/dark-mode-controller/commonjs/` with `{ type: "commonjs"}`.

### Fixed

- Main in `package.json` to point `./commonjs/dark-mode-controller.js`.

### Meta

**Development Only**

- Define task `compile: tsc -b ../tsconfig.json --listEmittedFiles` to build nested projects `commonjs/`, `types/`… etc.
- Define task `compile:types: tsc -p ../types/tsconfig.json` which emits `.d.ts` files in-place.
- Define task `compile:commonjs: tsc -p ../commonjs/tsconfig.json` which emits into `commonjs/`.
- Define task `compile:root: tsc -p ../tsconfig.json` which holds references to all nested projects.
- Define task `package: pushd packages && npm pack ../..` which generates tarballs for publishing.
- Moved all published tarballs into `packages/published`.

## [0.0.1] - 2019-11-06

- Initial release

[staging]: https://github.com/SMotaal/smotaal.github.io/tree/staging/packages/helpers/dark-mode-controller/
[0.0.1]: https://github.com/SMotaal/smotaal.github.io/packages/50383?version=0.0.1
[0.0.2]: https://github.com/SMotaal/smotaal.github.io/packages/50383?version=0.0.2
[0.0.3]: https://www.npmjs.com/package/@smotaal.io/dark-mode-controller/v/0.0.3
[0.0.4]: https://www.npmjs.com/package/@smotaal.io/dark-mode-controller/v/0.0.4
