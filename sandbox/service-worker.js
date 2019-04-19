// console.log('hello world');

{
	/** @type {ServiceWorkerRegistration} */
	const {scope} = registration;

	const root = new URL(scope).pathname;

	const mappings = {
		test: `${new URL('/sandbox/tests/hello-world/', location)}`,
		'smotaal.io': 'https://www.smotaal.io',
	};

	const frames = {};

	self.addEventListener('activate', event => {
		event.waitUntil(
			(async () => {
				await self.clients.claim();
				// const clients = await self.clients.matchAll();
				// for (const client of clients) {
				// 	console.log({client});
				// 	client.postMessage('ready');
				// }
				return;
			})(),
		);
	});

	self.addEventListener('install', event => {
		event.waitUntil(self.skipWaiting());
	});

	addEventListener('fetch', async event => {
		const {
			request: {url},
			resultingClientId,
			clientId,
		} = event;
		if (url.includes('/sandbox/')) {
			try {
				const {pathname, query, hash} = new URL(url, scope);
				const [sandbox, asset = '/'] = pathname.slice(root.length).split(/(?=\/.*$|$)/, 2);
				// const mapping = (frames[clientId] = mappings[sandbox]);
				const mapping = mappings[sandbox];
				resultingClientId && (frames[resultingClientId] = mapping);
				if (mapping) {
					const href = new URL(`.${asset}${query || ''}${hash || ''}`, mapping);
					console.log('fetch (sandboxed): %o', {event, pathname, query, hash, sandbox, asset, mapping, href});
					// event.respondWith(fetch(href).then(response => response.clone()));
					event.respondWith(fetch(href));
				} else {
					event.respondWith(Promise.reject(`sandbox "${sandbox}" is not initialized`));
				}
			} catch (exception) {
				console.log('fetch', event);
				console.warn(exception);
			}
		} else {
			const mapping = frames[clientId];
			if (clientId in frames) {
				console.log('fetch (unsandboxed): %o', {event, clientId, mapping});
			}
			event.respondWith(fetch(event.request));
		}

		// const mapping = frames[clientId || resultingClientId];
	});

	// addEventListener('message', async event => {

	// })
}
