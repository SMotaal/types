import {DarkModeController} from '../dark-mode-controller.js';

/** @type {{enable(): void; disable(): void; toggle(state?: boolean | 'auto'): void;}} */
export const darkMode =
	(typeof document === 'object' &&
		document &&
		//@ts-ignore
		(document.darkMode ||
			//@ts-ignore
			(document.darkMode = new (Object.preventExtensions(DarkModeController))(document.documentElement)))) ||
	undefined;
