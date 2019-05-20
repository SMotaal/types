/// <reference lib="webworker" />
ServiceWorker: {
	/** @type {ServiceWorkerGlobalScope} */
	const {registration, clients, addEventListener, skipWaiting, navigator, importScripts} = self;

	const root = Object.freeze(new URL(registration.scope));
	const frames = {};
	const containers = {
		['test']: `${new URL('/sandbox/tests/hello-world/', location)}`,
		['smotaal.io']: 'https://www.smotaal.io',
	};

	// const initializeContainerFromPath = (pathname, request = {}) => (
	// 	([request.container, request.asset = '/'] = pathname.slice(root.pathname.length).split(/(?=\/.*$|$)/, 2)), request
	// );

	const parseSandboxedURL = (url, request = {}) => {
		const {pathname = new URL(url).pathname} = url;
		pathname.startsWith(root.pathname) &&
			([request.container, request.asset = '/'] = pathname.slice(root.pathname.length).split(/(?=\/.*$|$)/, 2));
		return request;
	};

	// const initializeContainerFromInitiator = async request => {
	// 	const client = await clients.get(request.initiator);
	// 	console.log('client', client);
	// 	return parseSandboxedURL(client.url).container;
	// };

	const getContainerFromFrame = async frame => {
		const client = await clients.get(frame);
		const {container} = parseSandboxedURL(client.url);
		debug('default', {client, container});
		return container;
	};

	const routers = Object.freeze({
		['*']: async request => {
			({search: request.search, hash: request.hash, pathname: request.pathname} = new URL(request.url, root));
			// return !
			// request.initiator in frames

			if (request.url.startsWith(root)) {
				if (parseSandboxedURL(request.url, request).container in containers) {
					request.resolved = `${new URL(
						`.${request.asset}${request.query || ''}${request.hash || ''}`,
						containers[request.container],
					)}`;
				}
			}

			if ((request.frame = request.receiver || request.initiator)) {
				const sandbox =
					request.receiver && request.container
						? (frames[request.frame] = request.container)
						: request.frame in frames
						? await frames[request.frame]
						: request.initiator && (await (frames[request.initiator] = getContainerFromFrame(request.initiator)));
				if (sandbox) {
					if (sandbox in containers) {
						request.sandbox = sandbox;
					} else if (request.mode === 'navigate') {
						return routers.blocked(request);
					} else {
						return routers.unsandboxed(request);
					}
				}
			}

			return request.container
				? request.container in containers
					? routers.sandboxed(request)
					: routers.blocked(request)
				: ((request.type = 'undefined'), request);
		},
		// scoped
		// ['.']: request => {
		// 	request.type = 'scoped';

		// 	if (request.url.startsWith(root)) {
		// 		if (request.container && !request.asset) {
		// 			const {container, asset} = initializeContainerFromPath(request.pathname);
		// 			if (container !== request.container) return
		// 			 || (request.asset = asset);
		// 		}
		// 	}

		// 	if (request.asset) return routers['‹container›'](request);

		// 	if (request.container) {
		// 		return routers['.*.'](request);
		// 	}

		// 	// request.receiver || request.mode === 'navigate'
		// 	// 	? (request.frame = request.receiver)
		// 	// 	: (request.frame = request.initiator);

		// 	// request.router =
		// 	// 	((request.frame && request.frame in frames && (request.container = frames[request.frame])) ||
		// 	// 		(request.container &&
		// 	// 			request.container in containers &&
		// 	// 			(!request.frame || (frames[request.frame] = request.container)))) &&
		// 	// 	'‹container›';

		// 	(routers[request.router] || routers['‹void›'])(request);

		// 	return request;
		// },
		blocked: request => (
			(request.type = 'blocked'),
			(request.resolved = false),
			(request.response = Promise.reject(`requested url "${request.url}" cannot be resolved`)),
			request
		),
		unsandboxed: request => ((request.type = 'unsandboxed'), request),
		sandboxed: request => (
			(request.type = 'sandboxed'),
			// (request.resolved = `${new URL(
			// 	`.${request.asset}${request.query || ''}${request.hash || ''}`,
			// 	containers[request.sandbox || request.container],
			// )}`),
			request
		),
	});

	addEventListener('activate', event => event.waitUntil(clients.claim()));
	addEventListener('install', event => event.waitUntil(skipWaiting()));
	addEventListener('fetch', event => {
		const request = {init: {}, event};
		try {
			({
				clientId: request.initiator,
				// TODO: Align with spec
				//  https://fetch.spec.whatwg.org/#concept-request-replaces-client-id
				//   - Safari seems to not always report the resultingClientId
				resultingClientId: request.receiver,
				// TODO: Work through the various init options
				request: {
					body: request.init.body,
					cache: request.cache,
					credentials: request.credentials,
					headers: request.headers,
					integrity: request.integrity,
					keepalive: request.keepalive,
					method: request.init.method,
					url: request.url,
					mode: request.mode,
					referrerPolicy: request.referrerPolicy,
					referrer: request.referrer,
					redirect: request.redirect,
				},
				// isReload: request.reload,
			} = event).respondWith(
				request.url === location.href
					? fetch(event.request)
					: (async () =>
							(await routers['*'](request)).response ||
							(request.resolved ? fetch(request.resolved, request.init) : fetch(event.request)))(),
			);
		} catch (exception) {
			request.type = 'error';
			request.error = `${exception}`;
		} finally {
			debug(request.type, request);
		}
	});

	importScripts('/sandbox/lib/debug.js');
	// navigator.userAgent.includes('Firefox') &&
	importScripts('/sandbox/lib/debug.sanitize.js');

	const {[Symbol.for('debug')]: debug = console.log} = console;
}
