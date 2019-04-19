/// <reference lib="webworker" />
ServiceWorker: {
	/** @type {ServiceWorkerGlobalScope} */
	const {registration, clients, addEventListener, skipWaiting, navigator} = self;
	const {log} = console;
	const {scope} = registration;
	const root = new URL(scope).pathname;
	const frames = {};
	const mappings = {
		test: `${new URL('/sandbox/tests/hello-world/', location)}`,
		'smotaal.io': 'https://www.smotaal.io',
	};

	addEventListener('activate', event => event.waitUntil(clients.claim()));
	addEventListener('install', event => event.waitUntil(skipWaiting()));
	addEventListener('fetch', event => {
		let mode, url, frame, mapping, response, error, sandbox, asset;
		try {
			// NOTE: Safari seems to not always report the resultingClientId
			const {clientId, resultingClientId, request} = event;
			const scoped = (url = request.url).startsWith(scope);
			const scopable = clientId || resultingClientId || (scoped && request.destination === 'document');
			mapping = frames[(frame = clientId)];
			if (scopable && scoped) {
				const {pathname, query, hash} = new URL(url, scope);
				[sandbox, asset = '/'] = pathname.slice(root.length).split(/(?=\/.*$|$)/, 2);
				mapping || (mapping = mappings[sandbox]);
				resultingClientId
					? (frames[(frame = resultingClientId)] = mapping)
					: !clientId || clientId in frames || (frames[clientId] = mapping);
				if (mapping) {
					mode = 'sandboxed';
					response = fetch(new URL(`.${asset}${query || ''}${hash || ''}`, mapping));
				} else {
					mode = 'blocked';
					response = Promise.reject(`sandbox "${sandbox}" is not initialized`);
				}
			} else {
				mode = 'unsandboxed';
			}
			event.respondWith(response || fetch(event.request));
		} catch (exception) {
			error = `${exception}`;
		} finally {
			debug(error ? 'error' : mode, {mode, url, frame, mapping, response, error, sandbox, asset});
		}
	});

	/**
	 * @param {string|{toString}} aspect
	 */
	const debug = async (aspect, ...args) => {
		log(
			`%c%s%c %O`,
			`background: ${debug.colors[aspect] || '#69F'}; color: white; border-radius: 2px;`,
			` ${aspect} `,
			'',
			...args.map(debug.serialize),
		);
	};
	debug.colors = {sandboxed: '#0C3', unsandboxed: '#E90', blocked: '#F33', error: '#F00'};
	debug.serialize = navigator.userAgent.includes('Firefox') ? a => JSON.stringify(a, null, 2) : a => a;
}
