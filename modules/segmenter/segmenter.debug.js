const SEGMENT_MARGIN = `\u{00A0}`.repeat(10);
const RESET_STYLE = 'font-family: monospace; padding: 1px 0; margin: 1px 0; line-height: 1.75em;';
const SPACE = `\u{2423}`;
const TAB = `\u{2192}`;

const matchAll = Function.call.bind(
	String.prototype.matchAll ||
		{
			/**
			 * @this {string}
			 * @param {RegExp | string} pattern
			 */
			*matchAll() {
				const matcher = arguments[0] && (arguments[0] instanceof RegExp ? arguments[0] : RegExp(arguments[0], 'g'));
				const string = String(this);
				for (
					let match, lastIndex = -1;
					lastIndex <
					// (((arguments[0].lastIndex = lastIndex > -1 ? lastIndex : null), (match = next()))
					(((matcher.lastIndex = lastIndex > -1 ? lastIndex + 1 : null), (match = matcher.exec(string)))
						? (lastIndex = matcher.lastIndex)
						: lastIndex);
					yield match
				);
			},
		}.matchAll,
);

const FORMATTING = /(.*?)(%c|%s|%d|%[\d\.]*f|%o|%O|$)/g;

const COLORS = ['#CCCC00', '#00CCCC', '#CC00CC', '#FF6600', '#00FF66', '#6600FF'];

COLORS.empty = '#FF3333';
COLORS.feed = '#3333FF';
COLORS.sequence = '#33FF33';
COLORS.unknown = '#FF00FF';

const render = (format, ...values) => {
	const spans = [];

	FORMATTING.lastIndex = -1;
	if (typeof format === 'string' && FORMATTING.test(format)) {
		FORMATTING.lastIndex = -1;
		let i = 0;
		let span;
		const push = text => (span ? span.push(text) : spans.push(text));
		const roll = style => (span && spans.push(render.span(span.style, ...span)), (span = undefined));
		for (const [, pre, formatting = '%O'] of matchAll(format, FORMATTING)) {
			const value = values[i++];
			pre && push(render.pre(pre));
			switch (formatting.slice(-1)) {
				case 'c':
					roll();
					span = [];
					span.style = value;
					break;
				case 's':
					push(render.string(value));
					break;
				default:
					push(render.object(value));
					break;
			}
		}
	}

	return `<pre>${spans.join('')}</pre>`;
};

render.pre = value => `<span class="pre">${value}</span>`;
render.string = value => `<span class="string">${`${value}`.replace(/\t/g, '<tt class="tab">$&</tt>')}</span>`;
render.object = value => `<span class="object">${JSON.stringify(value)}</span>`;
render.span = (style, ...content) => `<span class="span" style="${style || ''}">${content.join('\u00A0')}</span>`;

export const debugSegmenter = (segmenter, sourceText, options) => {
	const {
		method = 'log',
		time = false,
		grouping = method !== 'render',
		warnings = true,
		colors = segmenter.colors || debugSegmenter.colors,
	} = {...options};
	const stamp = '' && ` #${Date.now()}`;
	time && console.time(`segmenting${stamp}`);
	const matches = [...matchAll(sourceText, segmenter)];
	time && console.timeEnd(`segmenting${stamp}`);
	const {length} = matches;
	// await new Promise(resolve => setTimeout(resolve, 100));
	time && console.time(`printing${stamp}`);
	grouping && console.group('output');
	const logs = [];
	const rendered = [];

	const uniqueTypes = [...new Set(segmenter.types.filter(type => typeof type === 'string'))];

	const INITIAL = method === 'render' ? '' : RESET_STYLE;
	// const print = console[method] || console.log;
	try {
		let format, segment;
		let lastIndex = -1;
		for (const [segment, match] of Object.entries(matches)) {
			if (!match) continue;
			format = '';
			let string, lines, index, type, typeIndex, properties, lookahead, inset;
			({0: string, index, type, typeIndex, lookahead, inset, ...properties} = match);
			const values = [];

			const delta = index - lastIndex;

			const skipped =
				(delta > 1 &&
					sourceText
						.slice(lastIndex, index - 1)
						.replace(/^\n/, '')
						.split(/\n/)) ||
				'';
			//

			format = '';

			if (skipped.length) {
				// (values.push(initial, `border: 1px solid coral; border-inline-width: 1px;  color: coral;`, skipped, initial),
				values.push(
					...skipped.flatMap((line, index) => [
						`${INITIAL} color: coral;`,
						index ? `\n${SEGMENT_MARGIN}` : `${'skipped'.padStart(SEGMENT_MARGIN.length - 1)}\u{00A0}`,
						`${INITIAL} border: 0 solid coral; border-left-width: 1.5px; border-right-width: 1.5px; color: coral;  background: #FFFAFA;`,
						line,
					]),
					INITIAL,
				),
					(format += `${`%c%s%c%s`.repeat(skipped.length)}%c\0`);

				logs.push([method, format, ...values.splice(0, values.length)]);
				format = '';
			}

			inset !== undefined && (properties.inset = inset);

			const overlap = (delta < 0 && string.slice(0, 1 - delta)) || '';
			overlap && logs.push(['warn', 'overlap:', {overlap, delta, match, index, lastIndex}]);

			const color = !type
				? colors.unknown || COLORS.unknown
				: type in colors
				? colors[type]
				: colors[(uniqueTypes.indexOf(type) || 0) % colors.length];

			{
				lines = string.slice((inset && inset.length) || 0).split(`\n${inset || ''}`);
				inset = (inset && (method !== 'render' ? inset.replace(/ /g, SPACE).replace(/\t/g, TAB) : inset)) || '';
				values.push(
					...lines.flatMap((line, index) => [
						`${INITIAL} color: ${color};`,
						`${INITIAL} border: 1px solid ${color}99; background: ${color}; color: white; font-weight: 300;`,
						inset || '\u200D',
						`${INITIAL} border: 1px solid ${color}99; color: ${color}99; background: ${color}11; font-weight: 500; text-shadow: 0 0 0 #999F;`,
						line || '\u200D',
						INITIAL,
					]),
				);
				format += `%c${type.padStart(
					SEGMENT_MARGIN.length - 1,
				)}\u{00A0}%c%s%c%s%c${`%c\n${SEGMENT_MARGIN}%c%s%c%s%c`.repeat(lines.length - 1)}`;
			}

			lookahead !== undefined &&
				(values.push(
					// INITIAL,
					// `${LOOKAHEAD_STYLE} color: white; background: darkgrey;`,
					// '?=',
					`${INITIAL} border: 1px solid #99999911; color: #99999999;`,
					`${
						JSON.stringify(`${(properties.lookahead = lookahead).slice(0, 5)}${lookahead.length > 5 ? '…' : ''}`)
							.replace(/\\\\/g, '\\')
							.replace(/^"(.*)"$/, '$1')
						// .replace(/%/g, '&x34;')
					}`,
					// INITIAL,
				),
				(format += `%c%s`));

			logs.push([method, `${format}`.trimRight(), ...values.splice(0, values.length)]);

			lastIndex = index + string.length;
			// return values;
		}
	} catch (exception) {
		logs.push(['warn', exception]);
	}
	time && console.timeEnd(`printing${stamp}`);
	if (method === 'render') {
		for (const [method, ...args] of logs) {
			method === 'render' && rendered.push(render(...args));
		}
	} else {
		for (const [method, ...args] of logs) {
			method in console && (warnings || method !== 'warn') && Reflect.apply(console[method], console, args);
		}
	}
	grouping && console.groupEnd();
	return rendered;
};

debugSegmenter.colors = COLORS;
