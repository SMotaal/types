/**
 * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
 *
 * @see https://github.com/SMotaal/markup/blame/e922e34487a7c02e13167b4b7527ec846170f3da/packages/tokenizer/examples/browser/api.js#L54
 *
 * @typedef {PointerEvent|MouseEvent} DarkModeController.handleEvent.TogglerEvent
 * @typedef {MediaQueryListEvent} DarkModeController.handleEvent.SystemEvent
 * @typedef {Readonly<Partial<Record<string, MediaQueryList>>>} DarkModeController.MediaQueries
 * @typedef {WeakMap<typeof DarkModeController | document, DarkModeController.MediaQueries>} DarkModeController.MediaQueriesCache
 * @typedef {'auto'|'enabled'|'disabled'} DarkModeController.State
 * @typedef {'light'|'dark'} DarkModeController.ColorScheme
 * @typedef {{id?: string, scope?: string, localStorage?: Storage, longPressTimeout?: number}} DarkModeController.Options
 *
 * @license MIT
 */
export class DarkModeController {
    /** @param {HTMLElement|Document} node */
    static getValidDocumentFrom(node: Document | HTMLElement): Document;
    /** @param {HTMLElement} container */
    static getLocalStorageFromContainer(container: HTMLElement): Storage;
    /**
     * @typedef {DarkModeController.MediaQueries} MediaQueries
     * @typedef {Document | typeof DarkModeController} Owner
     * @param {HTMLElement} container
     */
    static getMediaQueriesFromContainer(container: HTMLElement): Readonly<Partial<Record<string, MediaQueryList>>>;
    static get defaultView(): Window;
    static get createMatcher(): (regexp: RegExp) => <T>(source: T) => string;
    static get matchTrigger(): <T>(source: T) => string;
    static get matchID(): <T>(source: T) => string;
    static get matchScope(): <T>(source: T) => string;
    /** @param {HTMLElement} [container] @param {DarkModeController.Options} [options] */
    constructor(container?: HTMLElement, options?: {
        id?: string;
        scope?: string;
        localStorage?: Storage;
        longPressTimeout?: number;
    });
    set state(arg: "enabled" | "auto" | "disabled");
    get state(): "enabled" | "auto" | "disabled";
    detach(): void;
    set prefers(arg: "light" | "dark");
    get prefers(): "light" | "dark";
    get localStorage(): Storage;
    get mediaQueries(): Record<string, MediaQueryList>;
    get onPointerDown(): (event: PointerEvent) => void;
    get onPointerUp(): (event: PointerEvent) => void;
    get scope(): string;
    get id(): string;
    get key(): string;
    get container(): HTMLElement;
    get longPressTimeout(): number;
    /**
     * Returns a single bindable event handler for toggler element(s).
     *
     * @template {DarkModeController.handleEvent.TogglerEvent|DarkModeController.handleEvent.SystemEvent} E @param {E} [event]
     * @readonly
     * @memberof DarkModeController
     */
    handleEvent<E extends PointerEvent | MouseEvent | MediaQueryListEvent>(event?: E): void;
    /**
     * @param {DarkModeController.State|boolean} [state]
     * @param {boolean} [auto]
     */
    toggle(state?: boolean | "enabled" | "auto" | "disabled", auto?: boolean): Promise<void>;
    /** @param {boolean} [auto] */
    enable(auto?: boolean): void;
    /** @param {boolean} [auto] */
    disable(auto?: boolean): void;
}
export namespace DarkModeController {
    export namespace handleEvent {
        /**
         * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
         */
        export type TogglerEvent = PointerEvent | MouseEvent;
        /**
         * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
         */
        export type SystemEvent = MediaQueryListEvent;
    }
    /**
     * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
     */
    export type MediaQueries = {
        readonly [x: string]: MediaQueryList;
    };
    /**
     * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
     */
    export type MediaQueriesCache = WeakMap<typeof DarkModeController | Document, Readonly<Partial<Record<string, MediaQueryList>>>>;
    /**
     * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
     */
    export type State = "enabled" | "auto" | "disabled";
    /**
     * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
     */
    export type ColorScheme = "light" | "dark";
    /**
     * Reusable controller for Enhanced Dark Mode support via `prefers-color-scheme` media queries.
     */
    export type Options = {
        id?: string;
        scope?: string;
        localStorage?: Storage;
        longPressTimeout?: number;
    };
}
