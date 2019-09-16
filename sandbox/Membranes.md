# Membranes

First-class sandboxing can be attained with use of [ES-Style Membranes](https://github.com/ajvincent/es-membrane) which rely on proxies to contextually partition code to operate only on the separate and isolate manifestations of instances across its threshold.

> **Note**: There is likely far more research out there regarding the evolution of membranes, which will be documented later on.

## Rationale

When it comes to leading-edge challenges like sandboxing, one school looks to the platform for solutions, the other looks at ECMAScript as a first-class language, picking the latter usually goes further than mere preference, because it helps perpetuate the fundamental principles that have allowed the JavaScript legacy to continue to grow. And, membranes are first-class aspect that has [yet-to-be-tapped potential](https://github.com/caridy/secure-javascript-environment) for sandboxing.

There is more to be explored:

- Membrane for `debug` and `console` implementation.
- Membrane for `inspector` protocol.
- Membrane for `dom`.
