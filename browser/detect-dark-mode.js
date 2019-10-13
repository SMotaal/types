class DarkModeDetector {
	/**
	 * @param {HTMLElement} span
	 * @param {Record<'undefined'|'light'|'dark', string> labels
	 */
	constructor(span, labels) {
		let internal = {};
		internal.labels = {light: '☀︎', dark: '☾', undefined: '•'};
		labels &&
			(`${labels.light}` && (internal.labels.light = `${labels.light}`),
			`${labels.dark}` && (internal.labels.dark = `${labels.dark}`),
			`${labels.undefined}` && (internal.labels.undefined = `${labels.undefined}`));
		span || (span = globalThis.document.createElement('span'));
		(internal.root = span.attachShadow({mode: 'closed'})).append(
			(internal.label = new Text(internal.labels[undefined])), //
			(internal.target = (internal.document = span.ownerDocument).createElement('span')), //
		);
		// SEE: https://github.com/WebKit/webkit/blob/master/Source/WebCore/css/CSSValueKeywords.in
		internal.target.style.color = '-webkit-text';
		span.style.color === 'initial' && (span.style.color = internal.target.style.color);
		internal.target.computedStyleMap && (internal.style = Object.freeze(internal.target.computedStyleMap()));
		internal.update = this.update.bind(this, internal);
		internal.timer = setInterval(internal.update, 1000);
		Object.preventExtensions(
			Object.defineProperties(this, {
				update: {value: internal.update, enumerable: false, writable: false, configurable: false},
				'(internal)': {value: internal, enumerable: false, writable: false, configurable: false},
				mode: {enumerable: true, writable: true, configurable: false},
				color: {enumerable: true, writable: true, configurable: false},
				threshold: {enumerable: true, writable: true, configurable: false},
			}),
		);
		internal = null;
	}

	update(internal) {
		internal.target.isConnected || internal.document.body.appendChild(internal.root.host);
		internal.threshold !==
			(internal.threshold = this.threshold =
				255 -
				parseFloat(
					(/\b\d{1,3}|$/.exec(
						(internal.color = this.color = `${
							internal.style
								? internal.style.get('color')
								: internal.document.defaultView.getComputedStyle(internal.target)['color']
						}`),
					) || '0')[0],
				)) &&
			internal.mode !==
				(internal.mode = this.mode = (internal.threshold = internal.threshold) > 127 ? 'light' : 'dark') &&
			(((internal.label.textContent = internal.labels[internal.mode] || internal.mode), internal.state == null)
				? (internal.state = {...this})
				: internal.document.dispatchEvent(
						new CustomEvent('color-scheme-change', {
							detail: {instance: this, previousState: {...internal.state}, ...(internal.state = {...this})},
						}),
				  ));
	}
}

globalThis.document.darkModeDetector ||
	((globalThis.document.darkModeDetector = new DarkModeDetector(
		Object.assign(globalThis.document.createElement('div'), {
			style: `position: fixed; bottom: 0; left: 0; opacity: 0.25; padding: 0.25em; color: initial;`,
			inert: true,
		}),
	)),
	globalThis.document.addEventListener('color-scheme-change', console.log));
