//<!-- prettier-ignore --><script type="text/javascript" id=bootstrap>
if (globalThis.self && globalThis.navigator) {
	const name = (self.constructor && self.constructor.name) || 'Global';
	const {window, document, location} = self;

	console.log('[%s] %o', name, {self, window, location, document, navigator});

	if (document && window === document.defaultView) {
		typeof bootstrap === 'object' &&
			bootstrap.previousSibling &&
			(bootstrap.previousSibling.nodeType === bootstrap.COMMENT_NODE && bootstrap.previousSibling.remove(),
			bootstrap.previousSibling &&
				bootstrap.previousSibling.nodeType === bootstrap.TEXT_NODE &&
				(bootstrap.previousSibling.data = 'Now check the console :)'));
		self.Worker &&
			(new Worker(`${location}`, {type: 'classic'}).onmessage = ({data}) => console.log(`[Worker] %o`, data));
		// TODO: if (navigator.serviceWorker) import('/service-worker.js');
	} else if (self.postMessage) {
		postMessage({name, location: `${location}`});
	}
} else if (globalThis.process) {
	console.log('This works better in the browser!');
}
// </script>
