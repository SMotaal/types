//@ts-check

export * from './matcher.js';

import * as matcher from './matcher.js';

export declare class Matcher extends matcher.Matcher {
	colors?: Matcher.DebugOptions.Colors;
}

export declare namespace Matcher {
	//@ts-check

	export type Flags = string;
	export type Text = string | {toString(): string};

	export type Iterator<T extends RegExp = Matcher> = IterableIterator<
		T extends Matcher ? MatchArray : RegExpMatchArray | RegExpExecArray
	>;

	export interface Definition {
		entities: Entities;
		flags: Flags;
	}

	export type Pattern = (string | RegExp) & Definition;
	export type PatternFactory = (entity: EntityFactory) => Pattern;

	export interface MatchRecord {
		identity: Identity;
		entity: number;
		capture: Capture;
		matcher: Matcher;
	}

	export type MatchArray<T extends RegExpMatchArray | RegExpExecArray = RegExpExecArray> = T &
		Partial<MatcherMatchRecord>;
	export type MatchResult<T extends RegExpMatchArray | RegExpExecArray = RegExpExecArray> = T & MatchRecord;

	export interface Capture {
		[identity: Identity]: string;
	}

	export interface Entities extends Array<MatcherEntity> {
		flags?: string;
	}

	export type Entity = Identity | Operator | undefined;
	export type EntityFactory = {
		<T>(entity: Entity): T | void;
		(entity: Matcher): string;
	};

	export type Identity = string | symbol;
	export type Operator = <T>(text: string, capture: number, match: MatchArray, state?: T) => void;

	export interface Species extends Partial<RegExpConstructor> {
		[Symbol.species]?: this;
	}

	export interface MatchResultsArray<T extends RegExpMatchArray | RegExpExecArray = RegExpExecArray>
		extends Array<MatchResult<T>> {}

	/// Debugging

	export type DebugOptions = Partial<DebugOptions.ExternalOptions & DebugOptions.InternalDebugOptions>;

	export namespace DebugOptions {
		export type Colors<K extends string = string> = string[] & Partial<Record<K, string>>;

		export interface ExternalOptions {
			timing: boolean;
			warnings: boolean;
			method: 'log' | 'warn' | 'info' | 'render';
			colors: Colors;
		}

		export interface InternalDebugOptions extends ExternalDebugOptions {
			sourceText: string;
			matcher: Matcher;
			matches: MatchResultsArray;

			colors: Colors<this['uniqueTypes'][number]>;
			uniqueTypes: string[];
			logs: [ExternalOptions['method'], any[]];
		}
	}
}

// export {DELIMITER, UNKNOWN, escape, sequence, matchAll} from './matcher.js';
