import {Matcher} from './matcher.js';

export class Matches {
	/** @param {string} text @param {Matcher} matcher */
	constructor(text, matcher) {
		this.text = text;
		this.matcher = matcher;
	}

	get matches() {
		/** @type {Readonly<ArrayLike<Matcher.MatchResult<RegExpExecArray>>>} */
		const value = Object.freeze(Object.setPrototypeOf([...Matcher.matchAll(this.text, this.matcher)], null));
		Reflect.defineProperty(this, 'matches', {value, writable: false});
		return value;
	}

	get length() {
		return this.matches.length;
	}

	[Symbol.iterator]() {
		return Array.prototype[Symbol.iterator].call(this.matches);
	}
}
