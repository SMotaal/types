import {tokenizer} from '../../../../markup/dist/tokenizer.es.js';

(async () => {
	const compile = sourceText => {
		let classifier, expression;

		const {log, warn, info, group, groupEnd} = console;

		const logger = ({classifier, method = log, style = '', then} = {}) => (...args) => (
			method(`%c[%d] «%s${classifier ? ` ${classifier}` : ''}»\t%O\t%O`, style, ...args), then && then()
		);

		const Opener = logger({classifier: 'OPENER', method: group});
		const Closer = logger({classifier: 'CLOSER', method: log, then: groupEnd});
		const Operator = logger({classifier: 'OPERATOR'});
		const Whitespace = logger({classifier: 'WHITESPACE'});
		const Keyword = logger({classifier: 'KEYWORD'});
		const Identifier = logger({classifier: 'IDENTIFIER'});
		const Literal = logger({classifier: 'LITERAL'});
		const Unknown = logger({style: 'background-color: #FFA'});

		const compiler = {
			ECMAScript: {
				opener: Opener,
				closer: Closer,
				unknown: Unknown,
				keyword: {import: Keyword, from: Keyword},
				operator: {';': Operator},
				break: Whitespace,
			},
			String: {
				opener: Opener,
				closer: Closer,
				unknown: Unknown,
				quote: Literal,
			},
			unknown: Unknown,
		};

		const classifiers = {
			'ECMAScript keyword import': Keyword,
			'ECMAScript keyword from': Keyword,
			'ECMAScript operator': Operator,
			'ECMAScript identifier': Identifier,
			'ECMAScript inset': Whitespace,
			'ECMAScript whitespace': Whitespace,
			'ECMAScript break': Whitespace,
			'String quote': Literal,
			'TemplateLiteral quote': Literal,
			opener: Opener,
			closer: Closer,
			unknown: Unknown,
		};

		for (const token of tokenizer.tokenize(sourceText)) {
			const {
				text,
				type,
				goal: {name: goalName},
				contextNumber,
				state: {tokenContext},
				// whitespace,
			} = token;
			token[Symbol.toStringTag] = `‹${text}›`;
			(classifiers[(classifier = `${goalName} ${type} ${text}`)] ||
				classifiers[(classifier = `${goalName} ${type}`)] ||
				classifiers[(classifier = `${goalName} unknown`)] ||
				classifiers[(classifier = `${type}`)] ||
				classifiers[(classifier = `unknown`)])(contextNumber, goalName, token, tokenContext);
			// ((classifier = compiler[goal]) &&
			// 	(classifier = classifier[type] || classifier.unknown) &&
			// 	(typeof classifier === 'function' ||
			// 		(typeof classifier === 'object' &&
			// 			(classifier = classifier[text] || classifier.unknown) &&
			// 			typeof classifier === 'function'))
			// 	? classifier
			// 	: compiler.unknown)(number, goal, token);
		}
	};

	const load = async url => (await fetch(url)).text();

	const source = await load('https://unpkg.com/ses');

	compile(source);

	// (`
	// 	import { entities } from '@smotaal/tokenizer';

	// 	console.log(${'`[${import.meta.url}]`'}, {entities});
	// `);
})();
