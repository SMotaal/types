//@ts-check

type Matcher = import('./matcher');
type MatcherFlags = string;
type MatcherText = string | {toString(): string};

type MatcherIterator<T extends RegExp = Matcher> = IterableIterator<
	T extends Matcher ? MatcherMatchArray : RegExpMatchArray | RegExpExecArray
>;

interface MatcherDefinition {
	entities: MatcherEntities;
	flags: MatcherFlags;
}

type MatcherPattern = (string | RegExp) & MatcherDefinition;
type MatcherPatternFactory = (entity: MatcherEntityFactory) => MatcherPattern;

interface MatcherMatchRecord {
	identity: MatcherIdentity;
	entity: number;
	capture: MatcherCapture;
	matcher: Matcher;
}

type MatcherMatchArray<T extends RegExpMatchArray | RegExpExecArray = RegExpExecArray> = T &
	Partial<MatcherMatchRecord>;
type MatcherMatchResult<T extends RegExpMatchArray | RegExpExecArray = RegExpExecArray> = T & MatcherMatchRecord;

interface MatcherCapture {
	[identity: MatcherIdentity]: string;
}

interface MatcherEntities extends Array<MatcherEntity> {
	flags?: string;
}

type MatcherEntity = MatcherIdentity | MatcherOperator | undefined;
type MatcherEntityFactory = {
	<T>(entity: MatcherEntity): T | void;
	(entity: Matcher): string;
};

type MatcherIdentity = string | symbol;
type MatcherOperator = (text: string, index: number, match: MatcherMatchArray) => void;

interface MatcherSpecies extends Partial<RegExpConstructor> {
	[Symbol.species]?: this;
}
