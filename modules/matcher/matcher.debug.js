import {matchAll, LOOKAHEAD, INSET, OUTSET, DELIMITER} from './matcher.js';

export const debugMatcher = (matcher, sourceText, options = {}) => (
	({time: options.time = false, stamp: options.stamp = '' && ` #${Date.now()}`} = options),
	debugMatcher.matches(debugMatcher.match(matcher, sourceText, options), options)
);

debugMatcher.match = (matcher, sourceText, options = {}) => {
	const {time = false, stamp = ''} = options;
	time && console.time(`matching${stamp}`);
	options.matches = [...matchAll((options.sourceText = sourceText), (options.matcher = matcher))];
	time && console.timeEnd(`matching${stamp}`);
	return options.matches;
};

debugMatcher.matches = (matches, options = {}) => {
	const {
		method = 'log',
		time = false,
		stamp = '',
		warnings = true,
		matcher,
		colors = (matcher && matcher.colors) || debugMatcher.colors,
		logs = [],
		rendered = [],
		uniqueTypes = matcher &&
			matcher.entities && [...new Set(matcher.entities.filter(entity => typeof entity === 'string'))],
	} = options;

	time && console.time(`printing${stamp}`);

	const INITIAL = method === 'render' ? '' : RESET_STYLE;

	// const {records = rendered.records = []} = rendered;

	try {
		let format;
		let lastIndex = -1;
		for (const match of matches) {
			if (!match) continue;
			format = '';
			const {0: string, index, identity, entity, capture, ...properties} = match;
			let {[LOOKAHEAD]: lookahead, [INSET]: inset, [OUTSET]: outset, [DELIMITER]: delimiter} = capture;
			const values = [];
			const delta = index - lastIndex;
			const skipped = lastIndex > 0 &&
				delta > 1 && {index, lastIndex, delta, text: match.input.slice(lastIndex, index) || ''};

			format = '';

			if (skipped && skipped.text.length) {
				const {text, ...indices} = skipped;
				const details = CSS.escape(
					JSON.stringify(indices, null, 1)
						.replace(/"/g, '')
						.replace(/\s*\n\s*/, ' ')
						.slice(1, -1),
				);
				values.push(
					...(skipped.lines = text.replace(/^\n/, '').split(/\n/)).flatMap((line, index) => [
						`${INITIAL} color: coral;`,
						index ? `\n${SEGMENT_MARGIN}` : `${'skipped'.padStart(SEGMENT_MARGIN.length - 1)}\u{00A0}`,
						`${INITIAL} border: 0 solid coral; border-left-width: 1.5px; border-right-width: 1.5px; color: coral;  background: #FFFAFA; --details: "${details}";`,
						line,
					]),
					INITIAL,
				),
					(format += `${`%c%s%c%s`.repeat(skipped.lines.length)}%c\0`);

				logs.push([method, [format, ...values.splice(0, values.length)]]);
				format = '';
			}

			inset !== undefined && (properties.inset = inset);
			outset !== undefined && (properties.outset = outset);
			delimiter !== undefined && (properties.delimiter = delimiter);

			const overlap = (delta < 0 && string.slice(0, 1 - delta)) || '';
			overlap && logs.push(['warn', ['overlap:', {overlap, delta, match, index, lastIndex}]]);

			const color = !identity
				? colors.unknown || COLORS.unknown
				: identity in colors
				? colors[identity]
				: colors[((uniqueTypes && identity && uniqueTypes.indexOf(identity)) || entity || 0) % colors.length];

			{
				const start = (inset && inset.length) || 0;
				const end = (delimiter && -delimiter.length) || undefined;
				const lines = string.slice(start, end).split(`\n${inset || ''}`);
				inset = (inset && (method !== 'render' ? inset.replace(/ /g, SPACE).replace(/\t/g, TAB) : inset)) || '';
				values.push(
					...lines.flatMap((line, index) => [
						`${INITIAL} color: ${color};`,
						`${INITIAL} border: 1px solid ${color}90; background: ${color}EE; color: white; font-weight: 300;`,
						inset || '\u200D',
						`${INITIAL} border: 1px solid ${color}90; color: ${color}90; background: ${color}11; font-weight: 500; text-shadow: 0 0 0 #999F;`,
						line || '\u200D',
						INITIAL,
					]),
				);
				format += `%c${identity.padStart(
					SEGMENT_MARGIN.length - 1,
				)}\u{00A0}%c%s%c%s%c${`%c\n${SEGMENT_MARGIN}%c%s%c%s%c`.repeat(lines.length - 1)}`;

				// const details = CSS.escape(JSON.stringify({inset, delimiter}, null, 1).replace(/"/g, '').replace(/\s*\n\s*/, ' ').slice(1, -1));

				(delimiter =
					(delimiter && (method !== 'render' ? delimiter.replace(/ /g, SPACE).replace(/\t/g, TAB) : delimiter)) || ''),
					values.push(
						`${INITIAL} border: 1px solid ${color}90; background: ${color}EE; color: white; font-weight: 300;`, // --details: "${details}";
						delimiter || '\u200D',
						INITIAL,
					),
					(format += `%c%s%c`);
			}

			lookahead !== undefined &&
				(values.push(
					`${INITIAL} border: 1px solid #99999911; color: #99999999;`,
					`${JSON.stringify(`${(properties.lookahead = lookahead).slice(0, 5)}${lookahead.length > 5 ? '…' : ''}`)
						.replace(/\\\\/g, '\\')
						.replace(/^"(.*)"$/, '$1')}`,
				),
				(format += `%c%s`));

			logs.push([method, [`${format}`.trimRight(), ...values.splice(0, values.length)]]);

			lastIndex = index + string.length;
		}
	} catch (exception) {
		logs.push(['warn', [exception]]);
	}
	time && console.timeEnd(`printing${stamp}`);
	if (method === 'render') for (const [method, args] of logs) method === 'render' && rendered.push(render(...args));
	else
		for (const [method, args] of logs)
			method in console && (warnings || method !== 'warn') && Reflect.apply(console[method], console, args);
	// if (typeof safari === 'object') console.log(rendered);
	return rendered;
};

const SEGMENT_MARGIN = `\u{00A0}`.repeat(10);
const RESET_STYLE = 'font-family: monospace; padding: 1px 0; margin: 1px 0; line-height: 1.75em;';
const SPACE = `\u{2423}`;
const TAB = `\u{2192}`;
const FORMATTING = /(.*?)(%c|%s|%d|%[\d\.]*f|%o|%O|$)/g;

const COLORS = (debugMatcher.colors = ['#CCCC00', '#00CCCC', '#CC00CC', '#FF6600', '#00FF66', '#6600FF']);

COLORS: {
	COLORS.empty = '#FF3333';
	COLORS.feed = '#3333FF';
	COLORS.sequence = '#33FF33';
	COLORS.unknown = '#FF00FF';
}

const render = (format, ...values) => {
	const spans = [];

	FORMATTING.lastIndex = null;
	if (typeof format === 'string' && FORMATTING.test(format)) {
		FORMATTING.lastIndex = null;
		let i = 0;
		let span;
		const push = text => (span ? span.push(text) : spans.push(text));
		const roll = () => (span && spans.push(render.span(span.style, ...span)), (span = undefined));
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

render: {
	render.pre = value => `<span class="pre">${value}</span>`;
	render.string = value => `<span class="string">${`${value}`.replace(/\t/g, '<tt class="tab">$&</tt>')}</span>`;
	render.object = value => `<span class="object">${JSON.stringify(value)}</span>`;
	render.span = (style, ...content) => `<span class="span" style='${style || ''}'>${content.join('\u00A0')}</span>`;
}
