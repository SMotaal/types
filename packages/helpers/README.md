# @smotaal/packages/helpers

This folder contains helper packages refactored from experimental efforts.

## Packages

- [@smotaal/dark-mode-controller][]

## Logs

### 2019-11-07

#### Publishing @smotaal/dark-mode-controller on GPR

A refactor of the initial `dark-mode` implementation was needed for the new [@nodejs/nodejs.dev][]. At the time where the GitHub Package Registry was slated to go public, and so we explored this avenue.

**Considerations**

- Putting GPR to the test:

  - Pitfall: needs `.npmrc` to divert to the GPR registry along with a GitHub `read:packages` personal access token required a lot of "luck" to get `yarn` to work as needed.

  - Pitfall: needs `yarn cache clean` and `yarn --update-checksums` if you installed from `tarball` prior to publishing.

- Putting the frictionless philosophy in effect:

  - Goal: Meeting conventional build requirements with minimal moving parts.

- We're putting the perpetra philosophy in effect:

  - Goal: Keeping a smaller footprint made it reasonable to exclude things that conventionally people include, like specs.

    While common place, it is actually not advisable for such code to exist, nor is it fair to offload building the same code permutations onto the many when it only takes one really.

[@smotaal/dark-mode-controller]: ./dark-mode-controller/README.md
[@nodejs/nodejs.dev]: https://www.github.com/nodejs/nodejs.dev
