#!/usr/bin/env node --experimental-modules --no-warnings

import child_process from 'child_process';
import {fileURLToPath, pathToFileURL} from 'url';
import {createRequire} from 'module';
import {join as joinPath, resolve as resolvePath} from 'path';

const {
  env,
  argv: [arg0, arg1, ...argn],
} = process;

const cwd = process.cwd();

const stats = {};

stats['process.env'] = {...env};
stats['process.argv'] = [arg0, arg1, ...argn];

const Pattern =
  //@ts-ignore
  /** @type {new (source, flags?: string) => RegExp & {(string):boolean}} */ (class Pattern extends RegExp {
    /** @internal */
    static get ownProperties() {
      /** @type {Iterable<PropertyKey>} */
      const [, ...properties] = new Set([
        'constructor',
        ...Object.getOwnPropertyNames(this.prototype),
        ...Object.getOwnPropertySymbols(this.prototype),
        ...(this === Pattern
          ? [...Object.getOwnPropertyNames(super.prototype), ...Object.getOwnPropertySymbols(super.prototype)]
          : []),
      ]);

      return properties;
    }

    /** @internal */
    static get ownPropertyDescriptors() {
      if (this !== Pattern) return Object.getOwnPropertyDescriptors(this.prototype);

      /** @type {RegExpConstructor} */
      const Super = Object.getPrototypeOf(this);

      /** @type {PropertyDescriptorMap} */
      const ownPropertyDescriptors = {};

      /** @type {{[key: PropertyKey]: PropertyDescriptor}} */
      const descriptors = Object.getOwnPropertyDescriptors(Super.prototype);

      /** @type {any[]}} */
      const ownProperties = this.ownProperties;
      const inheritedMethods = [];
      const inheritedUndefineds = [];

      for (const property of ownProperties) {
        const descriptor = descriptors[property];
        if (!descriptor) continue;
        const isComputed = 'get' in descriptor || 'set' in descriptor;
        const value =
          !isComputed || 'get' in descriptor ? Super.prototype[property] : void inheritedUndefineds.push(property);
        if (!value || typeof value !== 'function') continue;
        inheritedMethods.push(property);
        ownPropertyDescriptors[property] = Object.getOwnPropertyDescriptor(
          class extends Super {
            get [property]() {
              const boundMethod = super[property].bind(this);
              Object.defineProperty(this, property, {
                value: boundMethod,
                enumerable: false,
                writable: false,
              });
              return boundMethod;
            }
          }.prototype,
          property,
        );
        ownPropertyDescriptors[property].configurable = true;
      }
      // console.log("Pattern.ownPropertyDescriptors", {
      //   this: this,
      //   ownProperties,
      //   ownPropertyDescriptors,
      //   inheritedMethods,
      //   inheritedUndefineds
      // });
      Object.defineProperty(this, 'ownPropertyDescriptors', {
        value: ownPropertyDescriptors,
        enumerable: false,
        writable: false,
      });
      return ownPropertyDescriptors;
    }

    /** @internal */
    static bind(instance, pattern) {
      if (!instance || !pattern) return;
      const bound =
        /** @type {WeakSet<Pattern|{}>} */ (Pattern.bind['bound'] || (Pattern.bind['bound'] = new WeakSet()));
      if (bound.has(instance)) throw TypeError(`Pattern.bind invoked with an instance that was previously bound`);
      if (!bound.has(pattern)) {
        if (!(pattern && pattern instanceof Pattern)) throw TypeError(`Pattern.bind invoked with an invalid pattern`);
        Object.defineProperties(pattern, this.ownPropertyDescriptors);
        bound.add(pattern);
      }
      for (const property of this.ownProperties) {
        if (typeof pattern[property] === 'function') instance[property] = pattern[property];
      }
      bound.add(instance);
      return instance;
    }

    constructor(source, flags) {
      //@ts-ignore
      super(...arguments);
      return /** @type {{(string): boolean} & RegExp} */ (new.target.bind(super.test.bind(this), this));
    }
  });

const Glob = new Pattern(/^(?=[^-])(?=.*[*/]|.*\.\w)/);

const args = (stats.args = /** @type {string[] & {[name:string]: string}} */ ([...argn]));

const glob = (stats.glob = (globIndex =>
  (args.glob = globIndex > -1 ? args.splice(globIndex, 1)[0] : Glob.test(env.GLOB) ? env.GLOB : undefined))(
  args.findIndex(Glob),
));

// console.log(stats);

const stack = (stats.stack = []);

/** @type {<T extends string>(kind:T) => {kind?: T}}  */
const Stack = kind => ((stack.push((stack.last = {kind})), stack.last));

const require = createRequire(import.meta.url);

if (glob) {
  const shell = Stack('shell');

  try {
    const bin = (shell.bin = resolvePath(
      require.resolve(joinPath('prettier', 'package.json')),
      ...['..', '..', '.bin', 'prettier'],
    ));
    ({
      output: [],
      ...shell.result
    } = child_process.spawnSync(
      (shell.command = bin),
      (shell.arguments = [
        '--no-color',
        '--no-config',
        // "--require-pragma",
        // "--loglevel",
        // "silent",
        // "--parser",
        // require.resolve("@smotaal.io/prettier/parser"),
        '-l',
        `"${glob}"`,
      ]),
      (shell.options = {cwd, shell: true}),
    ));

    shell.result.stdout = (shell.result.stdout && shell.result.stdout.toString()) || '';
    shell.result.stderr = (shell.result.stderr && shell.result.stderr.toString()) || '';

    // console.log(shell);

    if (shell.result.stderr && !shell.result.stdout) throw Error(shell.result.stderr);

    stats.globbed = shell.result.stdout.trim().split('\n');
    // stats.resolved = stats.globbed.map(path => resolvePath(cwd, path));

    // stats.globbed.map(path => console.log(resolvePath(cwd, path)));
    // stats.globbed.map(path => console.log(resolvePath(cwd, path)));
    console.log(stats.globbed.join('\n'));

    // console.log(stats);
    // console.log(stats.globbed);
  } catch (exception) {
    console.group(shell);
    console.warn(exception);
    console.groupEnd();
    stats.exception = shell.exception = exception;
  }
}

if (stats.exception) stack.map(stack => console.log(stack));

// (shell.command = `${bin} --no-color --loglevel=silent -l "${glob}"`),
