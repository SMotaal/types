<center>
<br/>

# <p>☾</p>Responsive Dark Mode for Github

### <kbd>CSS</kbd> <kbd>Monkey-Patching</kbd> <kbd>Frictionless</kbd>

<q>But it might seem like a waste of time, for someone to monkey-patc
h built _CSS_ artifacts instead of patching the _SCSS_ sources…</q>

Truth be told, you are right, but _SCSS_ is not _CSS_!

<br/>
</center>

_SCSS_ was initially conceived to close gaps in legacy _CSS_. Browsers have since evolved to offer standard _CSS_ alternatives, and all those are being ignored in mainstream due to residual legacy and _best practices_ myth.

> Something for the reader to ponder, if _SCSS_ was meant to improve development cycles, why is it taking GitHub and many others using it such a long time to add support for Dark Mode.

Senior developers should ask themselves if they are really caught up with the specs. Or, if they are really just happy in a comfort zone of their own choosing. By insisting to opt for abstractions of yesterday, and parroting the wisdom of it, we are perpetuating this façade where you are always right, by show of hand.

But for some who is discovering their own accessibility needs, we cannot always afford to not break away from the pack, because as much as we want to respect rank and tradition, we cannot ignore accessibility aspects that cannot be solved as effectively with all those unnecessary complexities getting in the way.

I personally, was an early adopter of Dark Mode, not because it is cool, but because it is a necessity for me to do my work. Having to do all this without _SCSS_ gave me great insights and forced deeper questions of how cascading can be used effectively to **toggle** very specific _CSS_ properties globally.

---

## Initial Thoughts

To me, GitHub presents a perfect opportunity. It has an astounding reach, UX/UI complexities, and more importantly, it is iconic in its adherence to the use-the-platform philosophy.

### Design

At first glance, you see their emphasis neutrals and contrast in all _stub matter_, along with a high degree of color coordination for _hint matter_.

To put this in perspective, we can say _stub matter_ is basically content that usually drives _flow_ and is normally the form of a stream of readable text, where _hint matter_ is what would interlaced within it or affixed around it.

From a design standpoint, it will become more clear as we make progress why it is important to make those kinds of subtle and overgeneralized classifications.

It's worth noting that those classifications are meant to help us reframe the nesting relationships of the respective content, and how this aligns very well with the cascading realities of styling.

So while there are no formal definitions for _stubs_ and _hints_, at least not in this context, we can think of _stubs_ in the sense that from the viewer's point-of-view they usually see only the part of the larger _flow_, where as _hints_ are usually entirely contained in their field of view (ie consumed without any scrolling so to speak).

The more common examples for _stubs_ include:

1. Rendered markdown content
2. Preformatted content
3. Lists of comments, issues, commits, tags, participants… etc.

As for _hints_, there are far too many classes to consider, but listing them would prove a challenging in that they can be categorized differently depending on the context, as will be seen later on.

This conceptual framework can structure our design process and considerations.

#### Considerations for Color

Color choices should prioritize on the overall harmony for _stubs_ and on the relative visibility for _hints_.

_Stubs_ primarily deal with one or more dominant _foreground_ color contrasting highly against a solid _background_, ie white on black, or vice versa.

> _Black_ and _White_ here are can just as well be approximations of respectives shades and sometimes even tints, not just pure the `#000000` and `#FFFFFF` ones.
>
> Our eyes are far more sensitive to this matter because it provides the dominant grays or neutrals that will define what is known as the perceived _white point_ and _color temperature_.
>
> Perceived color harmony in nested matter requires that all neutrals match closely to the _white point_ and _color temperature_ of more dominant elements — ie the neutral background component introduced by an ancestor and other elements dominating the field of view.

_Hints_ are a much wider spectrum, some merely a dimmed tint of the _foreground_ color, others having their own _foreground_, _outline_ and/or _backdrop_.

> _Backdrop_ here differs from background in the sense that it is sometimes just a banded overlay blending with in with the background of the parent _stub_.

#### Additional Considerations

Layout and typography choices should emphasize on the overall legability, readability and flow. Legibility can be improved by the appropriate font size and typefaces, like using a serif typeface for _body_ and sanserif one(s) for _code_ and/or _fixtures_. Readability can be improved by the intervals and rhythm of whitespace.

Inline elements should not be disruptive and may include:

- Formatting with _bold_, _italics_... etc.
- Fencing with _code_... etc.
- Decorations with _mark_, _anchor_... etc, which may include floating or user activated _hint matter_ as decendants.

Block elements should have a well defined _flow_ and may include:

- Sequence of _statements_ of similar _body_ blocks, including different forms of _paragraph_ for text or lines of _code_, that can be interlaced with the respective _fixtures_, including _display_ blocks (ie _headings_, _figures_, _tables_, _fragments_... etc) and _meta_ block (ie _decorations_ and _annotations_).
- Sequence of _elements_ sharing similar or related structures and layouts representative of a structured scheme.

### Artifacts

Initial efforts focus on artifacts used by the commonly used views.

Below is the summary of the related bundles:

```tsv
Type	Framework	GitHub
CSS	141 KB	387 KB
JS	143 KB	487 KB
```

<!--
Add screenshot of assets

|  JS  | Framework 143 KB | Bootstrap 487 KB |
| CSS  | Framework 141 KB | Bootstrap 387 KB |
-->

---

<style>@import "../../.vscode.markdown.css";</style>
