# @smotaal/dark-mode-controller

Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.

**Motivation**

Integrating a stable user experience for `media: prefers-color-scheme` can be difficult and can lead to inconsistencies when taming various framework or browser aspects. This controller focuses on the most essential aspects of this UX.

**Overview**

- Each controller is immutably constructred for a particular `contrainer` element which is used to populate any omitted options:

  > **Note** — Wiring only happens when constructed with a `container` with valid `ownerDocument` and `ownerDocument.defaultView`.

  1. Storage:

     > **TODO** — Explore opaque alternative `load`/`save` interface meeting the immediacy needs for preventing `onload` flashing.

     - Optional `localStorage` for storing `enabled` or `disabled` preferences — default `defaultView.localStorage`.

     - Optional `scope` for determining the root-relative portion of the storage `key` — default `ownerDocument.location` when missing or containing spaces.

     - Optional `id` fragment appended to the storage `key` to prevent collisions within a shared scope — default `""` when missing or containing spaces.

  2. User Preferences:

     > **TODO** — Explore detecting and adapting to `HID` and other system-wide preferences.

     - Optional `longPressTimeout` milliseconds for reverting to `auto` rounded between `1500` and `10000` — default `2000` when not a positive number.

- Each controller exposes two hooks for pointer `up` and `down` events that can wire into one or more toggler element(s).

  - Exposed methods are automatically bound within the controller so they can be passed to `toggler.addEventListener` or directly assigned to its `onpointerdown` or `onpointerup`.

    > **Note** — For browser compatibility, it might be better for the time being to check if `onmousedown` and `onmouseup` exist `in` the target and use them instead.

- Code lives in a single ECMAScript module for direct use for supporting runtimes.

- Type definitions are included for TypeScript versions that support `jsdoc` style annotations.

## Intended Uses

### Native

Let's assume you are loading ESM files directly in your browser:

```js
// Make sure you to adjust based on your own tooling
import {DarkModeController} from '/controllers/dark-mode-controller.js';

// Make sure you create this element first
const darkModeToggle = document.getElementById('dark-mode-toggle');

const darkModeController = new DarkModeController(document.documentElement);

// Use mouse events if present (until browsers get caught up)
darkModeToggle['onmousedown' in darkModeToggle ? 'onmousedown' : 'onpointerdown'] = darkModeController.onPointerDown;
darkModeToggle['onmouseup' in darkModeToggle ? 'onmouseup' : 'onpointerup'] = darkModeController.onPointerUp;
```

### Frameworks

Let's assume you are using TypeScript and have it configured for JSX:

<!--prettier-ignore-->
```ts
// Figure out how to import the actual framework based following
//   their best practices and conventions.
import Framework from 'Framework';

// Any framework that supports adding per specs event handlers
//   passing the `Event { type: 'pointerdown' | 'pointerup' }`
//   as a single or first argument.

// Figure out how to import this module based on your setup/tooling
import { DarkModeController } from '@smotaal/dark-mode-controller';

// You may need to do type coercion for the handlers in your preferred
//   way, but if all else fails, consider using an interface like:
interface FrameworkDarkModeController extends DarkModeController {
  onPointerDown(event: Framework.PointerEvent | PointerEvent): void;
  onPointerUp(event: Framework.PointerEvent | PointerEvent): void;
}

// Now you can create a coerced instance like so:

const darkModeController =
  (new DarkModeController() as any) as FrameworkDarkModeController;

// Finally, you may want to consider how you're exposing this
//   based on your project's structure and styles:
//
//   - You can export a singleton and wire it to components elsewhere:
export default darkModeController;
//
//   - Or export a component that wraps the singleton:
//
export const DarkModeToggle = () => (
  <button
    onPointerDown={darkModeController.onPointerDown}
    onPointerUp={darkModeController.onPointerUp}
  />
);

// NOTE: If you prefer to wire to the `Framework.MouseEvents`,
//   those should work and you can adjust the type definitions
//   to account for `onMouseDown{….onPointerDown}`… etc.
```

> **Note** — If you got it working with one or more framework(s), I'd be happy to know how easy or hard it was to do. I'm also interested to try to keep those instructions as minimal as possible, so I am open to making improvements as long as they are relevant and universally suited.

---

If you find `dark-mode-contoller` suitable for your particular case, please don't hesitate to contribute to this project. If not, please let me know why.
