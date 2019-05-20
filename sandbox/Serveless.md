# Serveless Sandboxing

- Sandbox playground (custom-element browser thingy)
- Investigate what the actual `<iframe srcdoc="…">.contentWindow.location` is.
- Prototype translations (including `jessica.translate()` API is ESM) of HTMLTemplate.innerHTML.
- Prototype a `navigation to ‹URL›` fetch helper.

## Scenario

Virtual desktop for widgets (written in "Jessie" code ie programmatically and HTML/CSS for the usual)

### `index.html`

```html
<jessie-desktop>
	<jessie-toolbar></jessie-toolbar>
	<jessie-widgets>
		<jessie-widget src="clock.jessie.widget.html" />
	</jessie-widgets>
</jessie-desktop>
```

- Host ≊ Desktop
  - `host.addWidget(‹html src›, …)` (like clock.jessie.widget.html)
  - `host.addExtension(‹esm src›, …)` (like captn.jessica.api.js)
    - `export const registerModule = async (…) => {}` (phase 1)
    - `export const registerGlobal = async (…) => {}` (phase 2)
- Frame ≊ Widget
  - Separate global (you never know really but it is)
    - Widget-facing APIs (single-instance)
      - Document APIs (builtin — phase 2)
      - TrustedTypes APIs (builtin — phase 3)
      - Web3 transactional APIs (extension API — phase 3)
      - CapTP passthru APIs (extension API — phase 3)

> Jessie has builtin mechanisms remote evaluation with completion callbacks.

## Early POC Gimmes

- IPC stuff (in-fix bag promise-like then/there callbacks)
- Extensions

### Registering globals (bootstrapped by `async` functions)

```js
import {implementation} from './implementation.js';

/** @type {{[contextId: string]: ContextRecord}} */
const contextRecords = {};

export const registerGlobals = async (contextRecord, host) => {
	let jwt;

	// This happens when bootstrapping
	// async stuff populates jwt

	return {
		// Throw is two extensions register the same global
		get remoteX() {
			// This happens after bootstrapping
			// returns x for that specific context
			return implementation.getX(contextRecord.context, jwt);
		},
	};
};
```

### Registering modules (bootstrapped by `async` functions)

```js
import {implementation} from './implementation.js';

/** @type {{[contextId: string]: ContextRecord}} */
const contextRecords = {};

export const registerModule = async (contextRecord, host) => {
	let makeFoo;

	// This happens when bootstrapping
	// async stuff populates makeFoo

	return {
		moduleURL: `‹absolute URL›`, // ie where a specifier resolves to
		// Eagerly instantiate all modules
		instantiate: () => {
			// This function is only ever called once
			//   to create a module record of the single
			//   namespace given to all importers
			const namespace = {default: makeFoo};
			return namespace;
		},
	};
};
```
