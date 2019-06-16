﻿import {matchAll, DELIMITER, UNKNOWN} from './matcher.js';

/** @param {Matcher} matcher @param {string} sourceText @param {Options} [options] */
export const debugMatcher = (matcher, sourceText, options = {}) => (
	({timing: options.timing = false} = options),
	debugMatcher.matches(debugMatcher.matchAll(matcher, sourceText, options), options)
);

/** @param {Matcher} matcher @param {string} sourceText @param {Options} [options] */
debugMatcher.matchAll = (matcher, sourceText, options = {}) => {
	const {timing = false} = options;
	const stamp = `${(timing === true && `-${Date.now()}`) || timing || ''}`;
	timing && console.time(`matching${stamp}`);
	options.matches = [...matchAll((options.sourceText = sourceText), (options.matcher = matcher))];
	timing && console.timeEnd(`matching${stamp}`);
	return options.matches;
};

/** @param {Matches} matches @param {Options} options */
debugMatcher.matches = (matches, options = {}) => {
	const {
		method = 'log',
		timing = false,
		warnings = true,
		matcher,
		colors = (matcher && matcher.colors) || debugMatcher.colors,
		logs = [],
		uniqueTypes = matcher &&
			matcher.entities && [...new Set(matcher.entities.filter(entity => typeof entity === 'string'))],
	} = options;
	const stamp = `${(timing === true && `-${Date.now()}`) || timing || ''}`;

	timing && console.time(`printing${stamp}`);

	const INITIAL = method === 'render' ? '' : RESET_STYLE;

	try {
		let format;
		let lastIndex = -1;
		for (const match of matches) {
			if (!match) continue;
			format = '';
			const {0: string, index, identity, entity, capture, input, ...properties} = match;
			//@ts-ignore
			let {[DELIMITER]: delimiter, [UNKNOWN]: unknown} = capture;
			const values = [];
			const delta = (properties.index = index) - (properties.lastIndex = lastIndex);
			const skipped = (properties.skipped = lastIndex > 0 &&
				delta > 1 && {index, lastIndex, delta, text: input.slice(lastIndex, index) || ''});

			format = '';

			if (skipped && skipped.text.length) {
				const {text, ...indices} = skipped;
				const details = CSS.escape(
					JSON.stringify(indices)
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

			// inset !== undefined && (properties.inset = inset);
			// outset !== undefined && (properties.outset = outset);
			unknown !== undefined && (properties.unknown = unknown);
			delimiter !== undefined && (properties.delimiter = delimiter);

			const overlap = (properties.overlap = (delta < 0 && string.slice(0, 1 - delta)) || '');
			overlap && warnings && logs.push(['warn', ['overlap:', {overlap, delta, match, index, lastIndex}]]);

			const color = !identity
				? colors.unknown || COLORS.unknown
				: identity in colors
				? colors[identity]
				: colors[((uniqueTypes && identity && uniqueTypes.indexOf(identity)) || entity || 0) % colors.length];

			const details = CSS.escape(
				JSON.stringify({properties, capture}, null, 1)
					.replace(/^(\s*)"(.*?)":/gm, '$1$2:')
					// .replace(/\s*\n\s*/g, ' ')
					.slice(2, -2),
			);

			{
				// const start = (inset && inset.length) || 0;
				// const end = (delimiter && -delimiter.length) || undefined;
				// const lines = string.slice(start, end).split(`\n${inset || ''}`);
				// inset = (inset && (method !== 'render' ? inset.replace(/ /g, SPACE).replace(/\t/g, TAB) : inset)) || '';
				// const lineFormat = `%c%s%c%s%c`;
				const lines = string.slice(0, (delimiter && -delimiter.length) || undefined).split(/\n|\r\n/g);
				const lineFormat = `%c%s%c`;
				values.push(
					...lines.flatMap((line, index) => [
						`${INITIAL} /* border: 1px solid ${color}90; */ color: ${color};${(!index &&
							` --color: ${color}; --details: "${details}";`) ||
							''}`,
						// `${INITIAL} border: 1px solid ${color}90; background: ${color}EE; color: white; font-weight: 300;`,
						// inset || '\u200D',
						`${INITIAL} border: 1px solid ${color}90; color: ${color}90; background: ${color}11; font-weight: 500; text-shadow: 0 0 0 #999F;`,
						line || '\u200D',
						INITIAL,
					]),
				);
				format += `%c${identity.padStart(
					SEGMENT_MARGIN.length - 1,
				)}\u{00A0}${lineFormat}${`%c\n${SEGMENT_MARGIN}${lineFormat}`.repeat(lines.length - 1)}`;

				(delimiter =
					(delimiter && (method !== 'render' ? delimiter.replace(/ /g, SPACE).replace(/\t/g, TAB) : delimiter)) || ''),
					values.push(
						`${INITIAL} border: 1px solid ${color}90; background: ${color}EE; color: white; font-weight: 300;"`,
						delimiter || '\u200D',
						INITIAL,
					),
					(format += `%c%s%c`);
			}

			logs.push([method, [`${format}`.trimRight(), ...values.splice(0, values.length)]]);

			lastIndex = index + string.length;
		}
	} catch (exception) {
		if (!warnings) throw (exception.stack, exception);
		else logs.push(['warn', [exception]]);
	}
	timing && console.timeEnd(`printing${stamp}`);

	return render[method === 'render' ? 'output' : 'console'](...logs);
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
	render.output = (...logs) => logs.flatMap(render.output.entry);
	render.output.entry = ([method, args]) => (method ? render(...args) : []);
	render.console = (...logs) => void logs.map(render.console.entry);
	render.console.entry = ([method, args]) => void (method in console && Reflect.apply(console[method], console, args));
}

/** @typedef {import('./matcher.types').Matcher} Matcher */
/** @typedef {import('./matcher.types').Matcher.MatchResultsArray} Matches */
/** @typedef {import('./matcher.types').Matcher.DebugOptions} Options */
/** @typedef {import('./matcher.types').Matcher.DebugOptions.InternalDebugOptions} InternalOptions */
/** @typedef {import('./matcher.types').Matcher.DebugOptions.ExternalOptions} ExternalOptions */
