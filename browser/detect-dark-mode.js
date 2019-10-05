// true || //
typeof document !== 'object' ||
	!document ||
	!document.body ||
	document.darkModeDetector ||
	console.log(
		(document.darkModeDetector = new (class DarkModeDetector {
			constructor() {
				this.labels = {undefined: '⚙︎', light: '', dark: '☾'};
				// SEE: https://github.com/WebKit/webkit/blob/master/Source/WebCore/css/CSSValueKeywords.in
				this.color = '-webkit-text';
				this.span = document.createElement('div');
				this.span.style.position = 'fixed';
				this.span.style.bottom = this.span.style.left = 0;
				this.span.style.opacity = 0.25;
				this.span.style.color = this.color;
				this.span.style.padding = '0.25em';
				// this.span.style.writingMode = 'vertical-rl';
				// this.span.style.textOrientation = 'upright';
				this.span.inert = true;
				this.span.text = this.span.appendChild(new Text(this.labels[undefined]));
				document.body.appendChild(this.span);
				// this.target = this.span;
				this.target = document.body;
				this.update = threshold =>
					(threshold = parseFloat(threshold) || 0) === this.threshold ||
					this.mode === (this.mode = (this.threshold = threshold) > 127 ? 'light' : 'dark') ||
					console.log(this.mode) ||
					(this.span.text.textContent = this.labels[this.mode]);
				this.handler = () => {
					this.target.style.currentColor = this.target.style.color;
					this.target.style.color = this.color;
					this.update(255 - (/\b\d{1,3}|$/.exec(window.getComputedStyle(this.target).color) || '0')[0]);
					this.target.style.color = this.target.style.currentColor;
				};
				this.timer = setInterval(this.handler, 1000);
			}
			// this.handler();
			// debugger;
		})()),
	);
