//<!-- prettier-ignore --><script type="text/javascript">
(async () => {
	const {self, navigator} = globalThis;

	if (self && navigator) {
		const name = (self.constructor && self.constructor.name) || 'Global';
		const {window, document, location} = self;

		console.log('[%s] %o', name, {self, window, location, document, navigator});

		if (document && window === document.defaultView) {
			document.body.innerText.startsWith('//') && document.body.firstChild.remove();
			self.Worker &&
				(new Worker(`${location}`, {type: 'classic'}).onmessage = ({data}) =>
					console.log(`[Worker] %o`, data));
			// TODO: if (navigator.serviceWorker) import('/service-worker.js');
		} else if (self.postMessage) {
			postMessage({name, location: `${location}`});
		}
	}
})();
// </script>
