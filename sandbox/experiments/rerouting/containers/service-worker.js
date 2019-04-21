/// <reference lib="webworker" />
ServiceWorker: {
	/** @type {ServiceWorkerGlobalScope} */
	const {registration, clients, addEventListener, skipWaiting, navigator} = self;
	const {log} = console;
	const root = Object.freeze(new URL(registration.scope));
	const frames = {};
	const containers = {
		['test']: `${new URL('/sandbox/tests/hello-world/', location)}`,
		['smotaal.io']: 'https://www.smotaal.io',
	};
	const routers = Object.freeze({
		['*']: request => (request.url.startsWith(root) ? routers['.'](request) : routers['..'](request)),
		// scoped
		['.']: request => (
			(request.type = 'scoped'),
			([request.container, request.pathname = '/'] = ({search: request.search, hash: request.hash} = new URL(
				request.url,
				root,
			)).pathname
				.slice(root.pathname.length)
				.split(/(?=\/.*$|$)/, 2)),
			// resolve the route
			(request.router =
				(request.initiator && request.initiator in frames && frames[(request.frame = request.initiator)]) ||
				(request.receiver && (request.frame = request.receiver), request.container in containers && '‹container›')) &&
				// save resolved root for the frame
				(!request.frame || request.frame in frames || (frames[request.frame] = request.router)),
			(routers[request.router] || routers['‹void›'])(request),
			request
		),
		['..']: request => (
			request.initiator in frames ? (request.type = 'unsandboxed') : (request.type = 'default'), request
		),
		['‹void›']: request => (
			(request.type = 'blocked'),
			(request.resolved = false),
			(request.response = Promise.reject(`requested url "${request.url}" cannot be resolved`)),
			request
		),
		['‹container›']: request => (
			(request.type = 'sandboxed'),
			(request.resolved = `${new URL(
				`.${request.pathname}${request.query || ''}${request.hash || ''}`,
				containers[request.container],
			)}`),
			request
		),
	});

	addEventListener('activate', event => event.waitUntil(clients.claim()));
	addEventListener('install', event => event.waitUntil(skipWaiting()));
	addEventListener('fetch', event => {
		const request = {init: {}, originalInit: {}};
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
					cache: request.originalInit.cache,
					credentials: request.originalInit.credentials,
					headers: request.originalInit.headers,
					integrity: request.originalInit.integrity,
					keepalive: request.originalInit.keepalive,
					method: request.init.method,
					url: request.url,
					mode: request.originalInit.mode,
					referrerPolicy: request.originalInit.referrerPolicy,
					referrer: request.originalInit.referrer,
					redirect: request.originalInit.redirect,
				},
			} = event).respondWith(
				routers['*'](request).response ||
					(request.resolved ? fetch(request.resolved, request.init) : fetch(event.request)),
			);
		} catch (exception) {
			request.type = 'error';
			request.error = `${exception}`;
		} finally {
			debug(request.type, request);
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
	debug.colors = {
		default: '#AAA',
		scoped: '#CC0',
		sandboxed: '#0C3',
		unsandboxed: '#E90',
		blocked: '#F33',
		error: '#F00',
	};
	debug.serialize = navigator.userAgent.includes('Firefox')
		? a => JSON.stringify(a, (k, v) => (typeof v === 'function' ? `${v}` : v), 2)
		: a => a;
}
