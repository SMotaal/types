//@ts-check

export class Matcher extends RegExp {
	/**
	 * @param {Matcher.Pattern} pattern
	 * @param {Matcher.Flags} [flags]
	 * @param {Matcher.Entities} [entities]
	 */
	constructor(pattern, flags, entities) {
		//@ts-ignore
		super(pattern, flags);
		(pattern &&
			pattern.entities &&
			Symbol.iterator in pattern.entities &&
			((!entities && (entities = pattern.entities)) || entities === pattern.entities)) ||
			Object.freeze((entities = (entities && Symbol.iterator in entities && [...entities]) || []));
		/** @type {Matcher.Entities} */
		this.entities = entities;
		({
			LOOKAHEAD: this.LOOKAHEAD = Matcher.LOOKAHEAD,
			INSET: this.INSET = Matcher.INSET,
			OUTSET: this.OUTSET = Matcher.OUTSET,
			DELIMITER: this.DELIMITER = Matcher.DELIMITER,
			UNKNOWN: this.UNKNOWN = Matcher.UNKNOWN,
		} = new.target);
	}

	/**
	 * @template {Matcher.Match} T
	 * @param {string} text
	 * @param {number} index
	 * @param {T} match
	 * @returns {T}
	 */
	capture(text, index, match) {
		if (index === 0) return void (match.capture = {});
		if (text === undefined) return;
		const {[index - 1]: entity} = this.entities;
		typeof entity === 'function'
			? (entity(text, index, match), (match.entity = index - 1))
			: entity == null ||
			  (entity === INSET ||
					entity === OUTSET ||
					entity === DELIMITER ||
					entity === LOOKAHEAD ||
					entity === UNKNOWN ||
					match.entity !== undefined ||
					((match.identity = entity), (match.entity = index - 1)),
			  //@ts-ignore
			  (match.capture[entity] = text));
	}

	exec(source) {
		/** @type {Matcher.Match} */
		const match = super.exec(source);
		match &&
			(match.forEach(this.capture || Matcher.prototype.capture, this),
			//@ts-ignore
			match.identity || (match.capture[this.UNKNOWN || Matcher.UNKNOWN] = match[0]));
		return match;
	}

	/**
	 * @param {Matcher.Pattern.Factory} factory
	 * @param {Matcher.Flags} [flags]
	 */
	static define(factory, flags) {
		const entities = [];
		const pattern = factory(entity => void entities.push(((entity != null || undefined) && entity) || undefined));
		return new ((this && (this.prototype === Matcher.prototype || this.prototype instanceof RegExp) && this) ||
			Matcher)(pattern, `${(flags == null ? pattern && pattern.flags : flags) || ''}`, entities);
	}

	static get sequence() {
		const {raw} = String;
		const {replace} = Symbol;
		/**
		 * @param {TemplateStringsArray} template
		 * @param  {...any} spans
		 * @returns {string}
		 */
		const sequence = (template, ...spans) =>
			sequence.WHITESPACE[replace](raw(template, ...spans.map(sequence.span)), '');
		/**
		 * @param {any} value
		 * @returns {string}
		 */
		sequence.span = value => (value != null && (typeof value !== 'symbol' && value)) || '';
		sequence.WHITESPACE = /^\s+|\s*\n\s*|\s+$/g;
		Object.defineProperty(Matcher, 'sequence', {value: Object.freeze(sequence), enumerable: true, writable: false});
		return sequence;
	}
}

export const {
	INSET = (Matcher.INSET = Symbol.for('INSET')),
	OUTSET = (Matcher.OUTSET = Symbol.for('OUTSET')),
	DELIMITER = (Matcher.DELIMITER = Symbol.for('DELIMITER')),
	UNKNOWN = (Matcher.UNKNOWN = Symbol.for('UNKNOWN')),
	LOOKAHEAD = (Matcher.LOOKAHEAD = Symbol.for('LOOKAHEAD')),
	escape = (Matcher.escape = /** @type {(source: Matcher.Text) => string} */ ((() => {
		const {replace} = Symbol;
		return source => /[\\^$*+?.()|[\]{}]/g[replace](source, '\\$&');
	})())),
	sequence,
	matchAll = (Matcher.matchAll =
		/**
		 * @template {RegExp} T
		 * @type {(string: Matcher.Text, matcher: T) => Matcher.Iterator<T> }
		 */
		//@ts-ignore
		(() =>
			Function.call.bind(
				// /* TODO: Uncomment eventually  */ String.prototype.matchAll ||
				{
					/**
					 * @this {string}
					 * @param {RegExp | string} pattern
					 */
					*matchAll() {
						const matcher = arguments[0] && (arguments[0] instanceof RegExp ? arguments[0] : RegExp(arguments[0], 'g'));
						const string = String(this);
						for (
							let match, lastIndex = ((matcher.lastIndex = null), -1);
							lastIndex <
							((match = matcher.exec(string)) ? (lastIndex = matcher.lastIndex + (match[0].length === 0)) : lastIndex);
							yield match, matcher.lastIndex = lastIndex
						);
					},
				}.matchAll,
			))()),
} = Matcher;

/** @typedef {(text: string, index: number, match: Matcher.Match) => void} Matcher.Operator */
/** @typedef {(string|symbol)} Matcher.Identity */
/** @typedef {Matcher.Identity|Matcher.Operator|undefined} Matcher.Entity */
/** @typedef {Partial<Record<Matcher.Identity, string>>} Matcher.Capture */
/** @typedef {RegExpExecArray & Partial<{identity: Matcher.Identity, entity: number, capture: Partial<Matcher.Capture>, matcher: Matcher}>} Matcher.Match */
/** @typedef {<T>(entity: Matcher.Entity) => T | void} Matcher.Entity.Factory */
/** @typedef {(entity: Matcher.Entity.Factory) => Matcher.Pattern} Matcher.Pattern.Factory */
/** @typedef {(string | RegExp) & Partial<{entities: Matcher.Entities, flags: Matcher.Flags}>} Matcher.Pattern */
/** @typedef {string} Matcher.Flags */
/** @typedef {Matcher.Entity[]} Matcher.Entities */
/** @typedef {string | {toString(): string}} Matcher.Text */
/** @template {RegExp} T  @typedef {IterableIterator<T extends Matcher ? Matcher.Match : RegExpMatchArray>} Matcher.Iterator */
