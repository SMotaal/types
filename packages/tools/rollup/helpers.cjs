exports.default = exports;

exports.escape = source => /[\\^$*+?.()|[\]{}]/g[Symbol.replace](source, '\\$&');

exports.dump = (value, options) =>
  console.dir(value, {
    compact: true,
    customInspect: true,
    depth: 5,
    ...options,
  });

class Scopes {
  /** @param {string[] | Record<string, string>} scopes */
  constructor(scopes) {
    this.mappings = {};

    if (scopes && typeof scopes === 'object') {
      const entries = Object.entries(scopes);
      const isArray = Array.isArray(scopes);
      for (const entry of Object.entries(scopes)) {
        this.mappings[/\/*$/[Symbol.replace](isArray ? entry[1] : entry[0], '/')] = /\/*$/[Symbol.replace](
          entry[1],
          '/',
        );
      }
    } else if (scopes != null) {
      throw TypeError(`Scopes cannot be constructed from ${typeof scopes}`);
    }

    scopes = Object.keys(this.mappings);

    if (!scopes.length) {
      this.mappings['/'] = './';
      scopes.push('/');
    }

    this.matcher = new RegExp(String.raw/* regexp */ `^(?:(${scopes.join('|')})|)(.*)$`);
  }

  [Symbol.iterator]() {
    return Object.keys(this.mappings)[Symbol.iterator]();
  }

  test(specifier) {
    return this.matcher.exec(specifier)[1] !== undefined;
  }
}

exports.Scopes = Scopes;

class Resolver {
  constructor(overrides) {
    this.root = undefined;
    this.scopes = undefined;
    this.logging = undefined;

    new.target.initialize(this, overrides);
  }

  resolveScope(context, specifier, referrer) {
    let scope, scopedId, id, base, path, match;

    const absolute = specifier.startsWith('/');
    const relative = !absolute && specifier.startsWith('../');

    path = specifier;

    if (this.scopes) {
      [, scope, scopedId] = match = this.scopes.matcher.exec(specifier);
    }

    const scoped = scope !== undefined;

    if (scoped) {
      path = `${this.scopes.mappings[scope]}${specifier.slice(scope.length)}`;
    }

    const bundled = scoped && scopedId.startsWith('dist/');
    const stats = `${absolute ? 'absolute ' : ''}${relative ? 'relative ' : ''}${scoped ? 'scoped ' : ''}${
      bundled ? 'bundled ' : ''
    }`.trim();

    const external = false; // bundled;

    base = `file://${!scoped && referrer ? referrer.replace(/\/[^/]*$/, '') : this.root}/`;

    id = external // && !/^\.{1,2}\//.test(path)
      ? `${
          specifier
          // path.startsWith('../') ? path.slice(2) : specifier
        }`
      : `${new URL(path, base)}`.replace(/^file:\/\/+/, '/');
    return {specifier, referrer, id, external, absolute, relative, scoped, bundled, stats};
  }

  resolveId(context, specifier, referrer) {
    let returned, resolution;
    try {
      const {id, external, absolute} = (resolution = this.resolveScope(context, specifier, referrer));
      if (referrer && external) return (returned = {external, id});
      if (id !== specifier) return (returned = {id});
      return (returned = null);
    } finally {
      if (this.logging > 0) {
        if (this.logging === 1) {
          console.log(returned || {specifier, referrer});
        } else {
          console.group(
            `\n\nresolveId(${context ? '\n %s' : '\n %O'}${'\n  %O, '
              .repeat(arguments.length - 1)
              .slice(0, -2)}\n) => %O\n`,
            context ? '<context>' : undefined,
            ...[...arguments].slice(1),
            returned,
          );
          if (resolution) {
            resolution.id && console.log(resolution.id);
            resolution.stats && console.dir(resolution.stats, {compact: true});
          }
          console.groupEnd();
        }
      }
    }
  }

  /** @param {Resolver} instance @param {{}} instance */
  static initialize(instance, overrides) {
    if (overrides == null) return;

    if (!overrides || typeof overrides !== 'object')
      throw TypeError(`Resolver overrides cannot be ${typeof overrides}`);

    // if (!overrides.isScope) overrides.isScope = undefined;
    // else if (typeof overrides.isScope === 'function')
    //   throw TypeError(`Resolver isScope override cannot be ${typeof overrides.isScope}`);

    let rootURL;

    try {
      rootURL = new URL(overrides.root, 'file:///');
      // overrides.root = new URL('.', resolvedRoot).pathname;
    } catch (exception) {
      throw URIError(
        `Resolver root override ${
          rootURL ? `"${overrides.root}" is not supported` : `cannot be ${typeof overrides.root}`
        } — ${exception.message}`,
      );
    }

    overrides.root = /\/*$/[Symbol.replace](rootURL.pathname, '');

    if (overrides.scopes) overrides.scopes = new Scopes(overrides.scopes);
    else overrides.scopes = undefined;

    Object.assign(instance, overrides);
  }
}

exports.Resolver = Resolver;

class Locator extends URL {
  get filename() {
    return Locator.toPath(this);
  }

  static toPath(locator) {
    Locator.toPath = require('url').fileURLToPath;
    return Locator.toPath(locator);
  }

  [Symbol.for('nodejs.util.inspect.custom')](depth, options) {
    return options.stylize(this.filename, 'string');
  }
}

exports.Locator = Locator;
