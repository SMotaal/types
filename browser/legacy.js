(
	typeof eval === 'function' &&
	/** @this {globalThis} this */ function Runtime(/** @type {Partial<Window>} */ endowments) {
		const {
			Object = /** @type {ObjectConstructor} */ ({}.constructor),
			console = /** @type {Console}  */ ((this && this.console) || {
				error(message) {
					throw message;
				},
			}),
		} = {
			...endowments,
		};
		// const Object = /** @type {ObjectConstructor} */ ({}.constructor);

		if (
			(this && '<-- smotaal.io/browser/legacy -->' in this) ||
			'<-- smotaal.io/browser/legacy -->' in
				Object.defineProperty(this, '<-- smotaal.io/browser/legacy -->', {
					writable: false,
					configurable: false,
					enumerable: false,
				})
		)
			// Dual instances
			return void (this.console && this.console.count('<-- smotaal.io/browser/legacy -->'));

		const Unsupported = function Unsupported() {
			return Reflect.construct(Error, arguments, Unsupported);
		};

		Object.setPrototypeOf(
			(Unsupported.prototype = Object.create(Error.prototype, {
				constructor: {value: Unsupported},
				type: {value: 'Unsupported'},
			})).constructor,
			Error,
		);

		if (!this || !(this.globalThis != null || (this.globalThis = this) || this === this.globalThis))
			throw Unsupported('‹global›');
		if (
			!(console || (console = {}.constructor.assign({}, this.console || (1, eval)('console')))) ||
			typeof console.warn !== 'function' ||
			typeof console.log !== 'function'
		)
			throw Unsupported('‹console›');

		const Promise = /** @type {PromiseConstructor} */ this.Promise;
		const self = (this === this.self && this.self) || undefined;

		const runtime = {
			initialize() {
				// runtime.legacy = false;
				if (!('description' in self.Symbol.prototype)) {
					runtime.legacy = true;
					runtime.defineProperty(self.Symbol.prototype, 'description', {
						get() {
							const error = Unsupported('Symbol.prototype.description');
							error.stack = '';
							runtime.dump(error);
						},
					});
				}
				// if (!runtime.legacy) return;
				if (self && 'onunhandledrejection' in self) {
					self.onunhandledrejection = runtime.unhandledRejection;
					runtime.removeSetter(self, 'onunhandledrejection');
				} else {
					runtime.abort(Unsupported('self.onunhandledrejection'));
				}
			},
			unhandledRejection(reason) {
				reason && (reason = runtime.getReason(reason.reason) || runtime.getReason(reason)) && reason.stack;
				runtime.dump(reason);
				// reason && reason.preventDefault && reason.preventDefault();
				// if (reason) throw reason;
			},
			warn(message) {
				console.warn(message);
			},
			dump(reason) {
				let dumped, message, html, element, format, description, divider, link;
				reason = runtime.getReason(reason) || '‹unknown›';
				divider = '—'.repeat(10);
				format = ['ENVIRONMENT', '', '\t\t%s', divider, '\t\t%s'].join('\n');

				description =
					'' +
					((reason &&
						((typeof reason.type === 'string' &&
							typeof reason.message === 'string' &&
							reason.type + ': ' + reason.message) ||
							reason)) ||
						'');
				reason && reason.stack && typeof reason.stack === 'string' && (description += '\n\nSTACK\n\n' + reason.stack);

				message = runtime.unmangle(
					format
						.replace(/%s/, runtime.mangle(runtime.userAgent))
						.replace(/%s/, runtime.inset(runtime.mangle(description), 2).trim()),
				);

				if (!dumped)
					try {
						element = self.document.createElement('code');
						element.setAttribute('style', ['color:white;pointer-events:none;'].join(''));

						if (!runtime.container) {
							runtime.container = self.document.createElement('pre');
							runtime.container.setAttribute(
								'style',
								[
									'all:initial;',
									'position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;',
									'overflow-y:scroll;',
									'overflow-x:hidden;text-overflow:ellipses;',
									'color:white;background:rgba(255,0,0,0.75);border:red;',
									'font-size:12pt;-webkit-text-size-adjust: 100%;',
									'padding:5vh 5vw;',
									'text-align:center;',
								].join(''),
							);
							for (const part of ('Oh No!\n\n' + divider + '\n' + message).split('\n' + divider + '\n')) {
								runtime.container.appendChild(element.cloneNode()).innerText = part;
								runtime.container.appendChild(self.document.createElement('hr'));
							}
							runtime.container.firstElementChild.setAttribute(
								'style',
								runtime.container.firstElementChild.getAttribute('style') +
									';font-weight:bold;text-shadow: 0 1px 1px black;',
							);
							if (/i(Phone |Pad |)(?:OS |)(?:1[0-1]|[1-9])/.test(runtime.userAgent)) {
								runtime.container
									.insertBefore(
										self.document.createElement('code'),
										runtime.container.firstElementChild.nextElementSibling,
									)
									.appendChild(self.document.createTextNode('\nYou may need to upgrade to iOS 12 — See '))
									.parentElement.appendChild((link = self.document.createElement('a')))
									.appendChild(self.document.createTextNode('Compatible Devices')).parentElement.href =
									'https://support.apple.com/en-us/HT209051';
							}
						} else {
							element.innerText = description;
							runtime.container.appendChild(element);
							runtime.container.appendChild(self.document.createElement('hr'));
						}
						(self.document.body || self.document).appendChild(runtime.container);
						dumped = true;
					} catch (exception) {
						runtime.warn(exception);
					}
				if (!dumped)
					try {
						self.alert(message);
						dumped = true;
					} catch (exception) {
						runtime.warn(exception);
					}
				reason.stack;
				return reason;
			},
			abort(reason) {
				throw runtime.dump(reason);
			},
			mangle(string, matcher) {
				return ('' + string).replace(matcher || /[^\w\s]\b/g, '$&\u200D');
			},
			unmangle(string, matcher) {
				return ('' + string).replace(matcher || /([^\w\s])\u200D(\b)/g, '$1$2');
			},
			inset(string, inset) {
				return inset <= 0
					? string
					: ('' + string).replace(/\n/g, '\n' + (!inset || (inset > 0 && '\t'.repeat(inset || 1)) || inset));
			},
			getReason(reason) {
				if (typeof reason === 'string' || typeof reason.message === 'string') return reason;
			},
			getDescriptor: Object.getOwnPropertyDescriptor,
			defineProperty: Object.defineProperty,
			removeSetter(object, property) {
				let descriptor;
				return !!(
					(descriptor = object != null && runtime.getDescriptor(object, property)) &&
					descriptor.set &&
					descriptor.configurable &&
					descriptor.get &&
					(delete descriptor.set, runtime.defineProperty(object, property, descriptor))
				);
			},
			userAgent: (self && self.navigator && self.navigator.userAgent && '' + self.navigator.userAgent) || undefined,
			container: /** @type  {HTMLElement} */ (undefined),
		};

		runtime.initialize();
	}
).call(self || global || (1, eval)('this'));
