---

Basically, some people continue on insisting that import 'pkg'; is not a URI. While this was conceptually important to assume as a contrived mental frame in order to specify ECMAScript modules in the most platform independent terms possible, it is also academically incorrect to accept it as actual fact… and imho continuing to do this just because we got used to thinking that way will prove more damaging when working on today's module-related challanges, ie platform's wanting their own namespaces.

Gus as I noted in his early ModuleWrap, used node:process internally because the best way to resolve relative specifiers is new URL(specifier, referrer) and (skipping technical) that mean resolve('./b.js', 'file:///~/a.js') resolved as a standard scheme to 'file:///~/b.js' and resolve('process', 'file:///~/a.js') was first internally changed to resolve('node:process', 'file:///~/a.js') and as a non-standard scheme this resolved to 'node:process' which was internally rewritten as createDynamicModule(require('process')).

The W**/ECMA are playing around std: (yuk) and js: (sweet) but each will want their own namespace (technically and academically wrong — those are called schemes, and they are not yet protocols even) — they each actually need their own schemes and protocols.

Now node (personal opinion removed) is steeing us from @nodejs which is a namespace to nodejs: as if it is a namespace — sure, cause the internet was born by calling things on a whim.

I am very furious and I know I sound very arrogant at this point, but I am here, trying to correct course, and accept that in life people want to think they are always the best people suited for the job with no scientific way for them to know better — I have a lot of respect to many in the group, I wish it was mutual.

But, if we break JavaScript, it is not just on them.

So calling it namespace: here is not just anally painful — it is technically far more complicated to consider portibility if you do that.

Why I am certain about my position — I implemented a node: protocol in electron 2 years ago just to explore that space well enough before I made any assumptions 🙂 (edited)

---
