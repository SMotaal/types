# Sandbox › Compiler

Runtime compilation of ECMAScript code is very different from conventional parsing done by tooling. Depending on how you decide to go about it, there will always be trade-offs that relate to verbosity, safety, performance, and portability.

The givens of parsing at runtime are matter-of-fact knowledge of the target and everything that entails, with two exceptions where out-of-band factors influence the <kbd>strict</kbd> or <kbd>module</kbd> parameters for parsing.

This work proposes an approach to safely layer runtime parsing cycles in ways that would potentially eliminate such unknowns, which is referred to as contemplative parsing.

The approach explored here is tailored to ECMAScript, but can be further extended in similar domains. Initial efforts focus exclusively on ECMAScript module code — which only limits the potential for non-strict code, but eliminates any potential for non-module code.

## Contemplative Parsing of ECMAScript code

The mechanics here are to intercept code before it is evaluated, and tame it sufficiently to intercept when the evaluated code will result in further code needing to be intercepted and evaluated.

Contemplative interceptions points include the following:

1. Imported modules (ie `import …` and `import(…)`).
2. Direct/Indirect evaluation (ie `eval(…)` or `new Function(…)`).

Contemplative taming considerations include the following:

1. Interception must take place prior to module loading (ie service-worker or loader).
2. Specifier rewrites should synchronize with context/realm module records.
3. Restrictions must irrecoverably throw.

### Interception of static `import …`

Contemplative parsing guarantees can be made about any occurrences of `import` which must occur top-level being attributed to the respective module.

This can be summarized with the following minimal input:

```js
import 'specifier';
import * as namespace from 'specifier';
```

### Interception of `eval` and dynamic `import(…)`

Contemplative parsing guarantees can be made about any occurrences of `eval` and dynamic `import(…)` being attributed to the parent `{…}` closure — with the one exception where such a closure is a literal or destructuring construct in which attribution traverses to the closest qualifying `{…}` closure.

This can be summarized with the following minimal input:

```js
{
  console.log({
    direct: eval('this'),
    indirect: (1, eval)('this')),
    promise: import('specifier'),
  });
}
```

### Interception of `new Function(…)`

TBD.
