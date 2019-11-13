﻿# Contributing Guide

This is my personal website, so if you are wanting to contribute, you are awesome… thanks!

## Getting Started

There are a number of separate repositories, each bring something to https://smotaal.io and so you might want to connect if you are not sure where to dive.

### Cloning the Root Workspace

You might want to start here if you will be doing work that involves building. If not, you might want to skip it.

1. Clone [SMotaal/smotaal.github.io`@staging`](https://github.com/SMotaal/smotaal.github.io/tree/staging/) which includes the root workspace setup.

2. Clone [SMotaal/components](https://github.com/SMotaal/components/) and [SMotaal/markup](https://github.com/SMotaal/markup/) into their respective folders.

**When you are done, your folder structure will look something like:**

```
~/                                      [@staging]
  packages/
           markout/
                   dist/                <- critical
                   lib/

  markup/                               [markup@master]
         dist/                          <- critical

  components/                           [components@master]
         lib/                           <- critical
```

If you are working on `markup` or `components` you might want to switch to `@staging` and to make sure you base all `@feature-…` branches off it.

### Cloning Separate Repositories

If you are going to be building, make sure you cover the previous section to set up the root workspace, otherwise, you can independently work on separate repositories.

3. Clone [SMotaal/…](https://github.com/SMotaal/) it only needs to in the respective folder per the previous section if you are building.

## Development

### Serving Locally

1. Run `npm start` or `yarn start` in the root folder to locally serve from in the root workspace or the separate repository.

## Troubleshooting

1. If you are using the root workspace, make sure that the sub folders outlined (ie `dist/` and `lib/`) are in the right place relative to the workspace root.

2. Make sure the correct branchs are checked out as outlined.

3. Check if there are related [issues](https://github.com/SMotaal/smotaal.github.io/issues/) that help address the problem.

4. If not, feel free to open one.

[smotaal.github.io`@staging`]:
[smotaal.github.io/issues]: https://github.com/SMotaal/smotaal.github.io/issues/
[components]: https://github.com/SMotaal/components/
[markup]: https://github.com/SMotaal/markup/
[…]: https://github.com/SMotaal/