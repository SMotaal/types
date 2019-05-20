# Sandbox › Introspector

Any decent sandbox solution must provide some abstractions for multi-threaded inspection and/or sandbox introspection.

A featherweight inspector agent (the `Introspector`) is an auto-bootstrapping entrypoint designed with the most essential initialization tasks (ie handshaking and hooking) to organically network with related threads in a fully encapsulated way.
