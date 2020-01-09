/** @typedef {typeof globalThis} GlobalThis */
/** @typedef {keyof GlobalThis} GlobalPropertyName */
/** @template {keyof GlobalThis} K  @typedef {Pick<GlobalThis, K>} Globals */
/** @typedef {Globals<'Array'|'ArrayBuffer'|'Boolean'|'DataView'|'Date'|'Error'|'EvalError'|'Float32Array'|'Float64Array'|'Function'|'Int8Array'|'Int16Array'|'Int32Array'|'Map'|'Number'|'Object'|'Promise'|'Proxy'|'RangeError'|'ReferenceError'|'RegExp'|'Set'|'SharedArrayBuffer'|'String'|'Symbol'|'SyntaxError'|'TypeError'|'Uint8Array'|'Uint8ClampedArray'|'Uint16Array'|'Uint32Array'|'URIError'|'WeakMap'|'WeakSet'>} GlobalConstructors */
/** @typedef {Globals<'Atomics'|'JSON'|'Math'|'Reflect'|'WebAssembly'>} GlobalNamespaces */

console.log(
  (() => {
    const global = globalThis;
    const Object = /** @type {ObjectConstructor} */ ({}.constructor);

    /**
     * @template {GlobalPropertyName} T
     * @param {T[]} names
     * @param {Partial<GlobalThis>} [overloads]
     */
    const globals = (names, overloads) =>
      names.reduce(
        overloads
          ? (globals, name) => (
              // @ts-ignore
              ({[name]: globals[name] = global[name]} = overloads), globals
            )
          : (globals, name) => (
              // @ts-ignore
              ({[name]: globals[name]} = global), globals
            ),
        {},
      );

    const namespaces = /** @type {GlobalNamespaces} */ (globals(
      /** @type {GlobalPropertyName[]} */ ('Atomics|JSON|Math|Reflect|WebAssembly'.split('|')),
    ));

    const constructors = /** @type {GlobalConstructors} */ (globals(
      /** @type {GlobalPropertyName[]} */
      ('Array|ArrayBuffer|Boolean|DataView|Date|Error|EvalError|Float32Array|Float64Array|Function|Int8Array|Int16Array|Int32Array|Map|Number|Object|Promise|Proxy|RangeError|ReferenceError|RegExp|Set|SharedArrayBuffer|String|Symbol|SyntaxError|TypeError|Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|URIError|WeakMap|WeakSet'.split(
        '|',
      )),
      [
        //@ts-ignore
        [TypeError, a => a()],
        [RangeError, () => (1).toString(0)],
        //@ts-ignore
        [ReferenceError, (a = a) => {}],
        [SyntaxError, () => JSON.parse('!')],
        [URIError, () => decodeURI('%0')],
      ].reduce(
        (constructors, [k, v], i) => {
          try {
            v();
          } catch (error) {
            i || ({constructor: constructors.Error} = Object.getPrototypeOf(error));
            ({constructor: constructors[/** @type {any} */ (k)]} = error);
          }
          return constructors;
        },
        /** @type {GlobalConstructors} */ ({
          Array: [].constructor,
          Boolean: false.constructor,
          Function: Object.constructor,
          Number: (0).constructor,
          Object,
          Promise: (async () => {})().constructor,
          RegExp: / /.constructor,
          String: ' '.constructor,
          Symbol: Object.getOwnPropertySymbols([].constructor.prototype)[0].constructor,
        }),
      ),
    ));
    return /** @type {GlobalConstructors & GlobalNamespaces} */ ({...constructors, ...namespaces});
  })(),
);
