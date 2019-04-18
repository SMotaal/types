export class SandboxContainer {
	constructor({frame}) {
		this.frame = frame;
		this.registered = new.target.registerServiceWorker();
	}

	async navigate(src) {
		const {frame} = this;
		if (!frame) return;
		// this.load(src, frame.iframe);
		await this.registered;
		this.frame.src = '';
		await new Promise(requestAnimationFrame);
		this.frame.src = src;
	}

	// async load(url, iframe) {
	// 	console.log({url, iframe});
	// 	await this.registered;
	// 	// const {parentElement} = iframe;
	// 	iframe.src = '';
	// 	// iframe.remove();
	// 	await new Promise(requestAnimationFrame);
	// 	const sourceText = await (await fetch(url)).text();
	// 	console.log({sourceText});
	// 	iframe.srcdoc = sourceText;
	// 	// return sourceText;
	// }

	reload() {
		this.frame && this.frame.reload();
	}

	/** @param {ServiceWorkerOptions} [options] */
	static async registerServiceWorker(options) {
		const {window, navigator} = globalThis;
		const serviceWorkerContainer = navigator && navigator.serviceWorker;

		let url, scope, type, registration;

		const Species = this || SandboxContainer;
		const {
			defaults: {serviceWorker: defaults} = SandboxContainer.defaults,
			registration: currentRegistration,
		} = Species;

		if (currentRegistration) {
			return currentRegistration;
		}

		if (serviceWorkerContainer) {
			({url = defaults.url, scope, type} = options = {...options});

			!'url' in options ||
				((url = `${new URL(url, location)}`), 'scope' in options || (scope = `${new URL('./sandbox/', url)}`));

			(url === defaults.url || !type) && (type = defaults.type);

			registration = await (Species.registration = serviceWorkerContainer.register(url, {scope, type})).then(
				async registration => {
					registration.installation && console.log('installation: %o', await registration.installation);
					registration.active && console.log('installation: %o', await registration.active);
					return registration;
				},
			);

			console.log('registration: %o', {arguments: arguments[0], defaults, url, scope, type, registration});
		}

		return registration;
	}

	static get defaults() {
		return defaults;
	}
}

const defaults = {};

const base = (defaults.base = `${new URL(
	'./',
	(typeof location === 'object' && location.href) || import.meta.url,
)}`.replace(/\/(?:dist|lib)\/^/, '/'));

defaults.serviceWorker = Object.freeze({
	url: `${new URL('./service-worker.js', base)}`,
	// scope: `${new URL('./sandbox/', base)}`,
	type: 'classic',
});

Object.freeze(defaults);

/** @typedef {Partial<defaults.serviceWorker>} ServiceWorkerOptions */
