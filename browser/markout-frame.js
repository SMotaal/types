// console.log((({document, frameElement, parent}) => ({document, frameElement, parent}))(globalThis));

const {frameElement, ResizeObserver} = globalThis;

const ResizeObserverPrototype = {
	/** @type {() => void} */
	handler: undefined,
	/** @type {() => void} */
	connect: undefined,
	/** @type {() => void} */
	disconnect: undefined,
	size: '0×0',
	interval: 1000,
	update() {
		typeof this.handler !== 'function' ||
			this.size === (this.size = `${document.body.scrollWidth || 0}×${document.body.scrollHeight || 0}`) ||
			this.handler();
	},
};

/** @param {() => void} handler */
export const createResizeObserver = handler => {
	/** @type {typeof ResizeObserverPrototype} */
	const observer = {...ResizeObserverPrototype, handler};

	if (typeof ResizeObserver === 'function') {
		observer.observer = new ResizeObserver(handler);
		({
			connect: observer.connect = (ResizeObserverPrototype.connect = {
				connect() {
					this.observer.observe(document.body);
				},
			}.connect),
			disconnect: observer.disconnect = (ResizeObserverPrototype.disconnect = {
				disconnect() {
					this.observer.disconnect();
				},
			}.disconnect),
		} = ResizeObserverPrototype);
	} else {
		({
			connect: observer.connect = (ResizeObserverPrototype.connect = {
				connect() {
					this.disconnect();
					this.size = ResizeObserverPrototype.size;
					this.timer = setInterval(
						() => this.update(),
						(this.interval = this.interval > 0 && this.interval < Infinity ? Number(this.interval) : 1000),
					);
					this.update();
					console.log(this, {...this});
				},
			}.connect),
			disconnect: observer.disconnect = (ResizeObserverPrototype.disconnect = {
				disconnect() {
					this.timer = void (this.timer == null || clearInterval(this.timer));
				},
			}.disconnect),
		} = ResizeObserverPrototype);
	}
	// for (const propertyName of ['connect', 'disconnect', 'handler', 'observer', 'update']) {
	// 	Object.defineProperty(observer, propertyName, {value: observer[propertyName], writable: false});
	// }

	// console.log({ResizeObserverPrototype, observer});
	return observer;
};

export const resizeFrameElement = async () => {
	if (!frameElement) return;

	frameElement.width = '100%';
	frameElement.height = '0';

	'resizeObserver' in document ||
		Object.defineProperty(document, 'resizeObserver', {
			value: createResizeObserver(() => void (frameElement.height = document.body.scrollHeight)),
			writable: false,
		});

	document.resizeObserver.connect();
	// document.resizeObserver.update();

	await new Promise(setTimeout);
};

if (frameElement) {
	/[?&]resize(?:&|$)/.test(import.meta.url) && resizeFrameElement();
}

// /** @type {string} */
// observer.size = undefined;
// observer.target = document.scrollingElement;

// /** @type {number} */
// observer.interval = observer.width = observer.height = undefined;

// /** @type {() => void} */
// observer.update = observer.connect = observer.disconnect = undefined;

// /** @type {any} */
// observer.timer = observer.observer = undefined;

// observer.handler = handler;

// observer.update = {
// 	update() {
// 		(this.target ===
// 			(this.target = {scrollWidth: this.width, scrollHeight: this.height} = document.scrollingElement) &&
// 			this.size === (this.size = `${this.width}×${this.height}`)) ||
// 			this.handler();
// 	},
// }.update;

//////
// const {
// 	resizeObserver = (frameElement.resizeObserver = new ResizeObserver(() => {
// 		const {scrollHeight} = document.body;
// 		frameElement.height === scrollHeight || (frameElement.height = scrollHeight);
// 	})),
// } = frameElement;
// if (resizeObserver.currentDocument === document) return;
// else if (resizeObserver.currentDocument != null) resizeObserver.disconnect();

// frameElement.width = '100%';
// frameElement.height = '0';
// resizeObserver.observe(document.body);
