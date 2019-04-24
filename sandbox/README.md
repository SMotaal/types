# smotaal.io/sandbox

## Phase 1

The initial phase explored the concept of _sandboxing-by-remapping_ using a service worker.

You can try it out [here](./experiments/remapping/index.html)

<blockquote>

**Important Note**: Client resolvable URLs for sub resources which start with a `/` are not being remapped to retain traceability.

</blockquote>

- The demo page includes a `<sandbox-frame>` element

- The `<sandbox-frame>.container` is initialized a private `SandboxContainer` instance.

- The `SandboxContainer` instance registers the `containers/service-worker.js` for the `containers/` scope.

- Navigation is delegated to `<sandbox-frame>.container.navigate(‹url›)`

  This ensures the completion of registration of the service worker before setting the `src` attribute for iframe.

- The service worker intercepts fetch events matching the `‹scope›/‹sandbox›/‹asset›` format to determine the intent of a request.

**Resolution Procedure**

1. If a `resultingClientId` is present, then create and holds on to a new `client-to-sandbox` mapping record

   <blockquote>

   **Important Note**: Safari seems to not always provide the necessary details so the current implementation will sometimes work around missing details.

   </blockquote>

   This record will remain in effect until the same `clientId` makes a request with a different `resultingClientId` or a different `clientId` makes a request with the same `resultingClientId` (whichever comes first).

2. If no `client-to-sandbox` was created and one does not exists for `clientId` then the service-worker result in a noop on the intercepted fetch event.

3. If the request matches the `‹sandbox›/‹asset›` format, then, perform simple prefix rewrite and log as `sandboxed`.

   <blockquote>

   _Note_: Remapping for `‹sandbox›` uses a hardcoded lookup (for now).

   </blockquote>

4. Else, fetch the request nonetheless and log as `unsandboxed`.
