/**
 * **Late comer test for postMessage in browser contexts**
 *
 * A singleton must rely on some signal to know if it is the only instance.
 *
 * ```ts
 * declare const x = 1;
 * ```
 *
 * One that does not implicate the scope could rely on `onmessage` event.
 *
 * @param {*} listeners
 */
const postMessageTest = listeners => (
	(listeners = []),
	new Promise(resolve => {
		globalThis.addEventListener(
			...listeners[
				listeners.push([
					'message',
					event => {
						event.preventDefault();
						event.stopPropagation();
						event.stopImmediatePropagation();
						requestAnimationFrame(resolve);
						console.log(1, event);
					},
					{passive: false, capture: true, once: false},
				]) - 1
			],
		);
		globalThis.addEventListener(
			...listeners[
				listeners.push([
					'message',
					event => {
						console.log(2, event);
					},
					{passive: true, capture: true, once: true},
				]) - 1
			],
		);
		globalThis.postMessage('a', location);
		globalThis.postMessage('b', location);
	}).finally(() =>
		listeners.forEach(listener => {
			globalThis.removeEventListener(...listener);
			globalThis.postMessage('c', location);
		}),
	)
);

export default async () => {};
