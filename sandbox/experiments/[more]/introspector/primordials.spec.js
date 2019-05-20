/** @template {keyof globalThis} K  @typedef {Pick<globalThis, K>} Globals */
/** @typedef {Globals<'Array'|'ArrayBuffer'|'Boolean'|'DataView'|'Date'|'Error'|'EvalError'|'Float32Array'|'Float64Array'|'Function'|'Int8Array'|'Int16Array'|'Int32Array'|'Map'|'Number'|'Object'|'Promise'|'Proxy'|'RangeError'|'ReferenceError'|'RegExp'|'Set'|'SharedArrayBuffer'|'String'|'Symbol'|'SyntaxError'|'TypeError'|'Uint8Array'|'Uint8ClampedArray'|'Uint16Array'|'Uint32Array'|'URIError'|'WeakMap'|'WeakSet'>} GlobalConstructors */

console.log(
	((
		global = globalThis,
		Object = {}.constructor,
		globals = (names, overloads) =>
			names.reduce(
				overloads
					? (globals, name) => (({[name]: globals[name] = global[name]} = overloads), globals)
					: (globals, name) => (({[name]: globals[name]} = global), globals),
				{},
			),
		namespaces = globals('Atomics|JSON|Math|Reflect|WebAssembly'.split('|')),
		/** @type {GlobalConstructors} */
		constructors = globals(
			'Array|ArrayBuffer|Boolean|DataView|Date|Error|EvalError|Float32Array|Float64Array|Function|Int8Array|Int16Array|Int32Array|Map|Number|Object|Promise|Proxy|RangeError|ReferenceError|RegExp|Set|SharedArrayBuffer|String|Symbol|SyntaxError|TypeError|Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|URIError|WeakMap|WeakSet'.split(
				'|',
			),
			[
				[TypeError, a => a()],
				[RangeError, () => (1).toString(0)],
				[ReferenceError, (a = a) => {}],
				[SyntaxError, () => JSON.parse('!')],
				[URIError, () => decodeURI('%0')],
			].reduce(
				(constructors, [k, v], i) => {
					try {
						v();
					} catch (error) {
						i || ({constructor: constructors.Error} = Object.getPrototypeOf(error));
						({constructor: constructors[k]} = error);
					}
					return constructors;
				},
				{
					Array: [].constructor,
					Boolean: false.constructor,
					Function: Object.constructor,
					Number: (0).constructor,
					Object,
					Promise: (async () => {})().constructor,
					RegExp: / /.constructor,
					String: ''.constructor,
					Symbol: Symbol('').constructor,
				},
			),
		),
	) =>
		/** @type {constructors & namespaces} */
		({...constructors, ...namespaces}))(),
);
