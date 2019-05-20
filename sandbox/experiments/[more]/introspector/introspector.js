new class Introspector {
	constructor() {
		/** @type {[LexicalScope]} */
		const [lexical] = arguments;
		const {global, context, internal} = new.target;
	}

	/** @type {GlobalScope} */
	static get global() {
		return globalThis;
	}

	static get context() {
		const {self, navigator, document, location, postMessage, addEventListener} = globalThis;

		const id = (Math.random() * 10e8).toString(32);

		if (location && self && self.self === self) {
			let listener;
			Promise.race([
				new Promise(resolve => {
					self.addEventListener(
						...(listener = ['message', ({source, data}) => source === self && data === id, resolve(true)]),
						{passive: true, capture: true, once: true},
					);
					postMessage(id, location);
				}),
				new Promise(setTimeout),
			]).then(resolved => {
				self.removeEventListener(...listener);
				if (!resolved) return;
				const context = {id, location, onmessage: undefined};
				/** @param {MessageEvent} event */
				listener[1] = {
					message({source, data}) {
						if (event.source === self) {
							event.preventDefault();
							event.stopPropagation();
							event.stopImmediatePropagation();
							console.warn(event);
						} else if (context.onmessage) {
							// const {id, body} = {...data};
							context.onmessage(event);
						} else {
							console.log(event.data);
						}
					},
				}.message.bind(context);
				self.addEventListener(...listener, {passive: false, capture: true, once: false});
				return context;
			});
		}

		// const {global, process,} = globalThis;
		// if (global && 'proces' in global) {}
	}
}(this);

/** @typedef {self | undefined} LexicalScope */
/** @typedef {globalThis} GlobalScope */

// window &&
// document &&
// 'defaultView' in document &&
// document.defaultView === window &&
// typeof window.addEventListener === 'function'
