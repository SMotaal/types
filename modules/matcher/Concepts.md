# @smotaal/matcher

Featherweight declarative RegExp matcher.

The concepts relate to or abstract upon aspects of the [RegExp (Regular Expression) Objects (section 21.2 of the ECMAScript® Language Specification)](http://www.ecma-international.org/ecma-262/#sec-regexp-regular-expression-objects).

## Patterns

Key aspects deriving from the official [ECMAScript® specification for Patterns](http://www.ecma-international.org/ecma-262/#sec-patterns) include the following highlights:

<!--prettier-ignore-start-->

<pre><code><a href="http://www.ecma-international.org/ecma-262/#prod-PatternCharacter"><var>PatternCharacter</var></a> ::</code>
  <code><a href="http://www.ecma-international.org/ecma-262/#prod-SourceCharacter"><var>SourceCharacter</var><a/> but not <a href="http://www.ecma-international.org/ecma-262/#prod-SyntaxCharacter"><var>SyntaxCharacter</var></a></code></pre>

<pre><code><a href="http://www.ecma-international.org/ecma-262/#prod-SyntaxCharacter"><var>SyntaxCharacter</var></a> :: one of</code>
  <code>^ $ \ . &#x2A; + ? ( ) [ ] { } |</code></pre>

<!--prettier-ignore-end-->

## Matching

The abstract operation of stepping through zero or more adjacent characters from any given starting position looking for the first matching occurenc in those characters from which all respective position of the pattern to be matched are satisfied by respective adjacent characters, the result of which is expressed as a match record denoting the first matched character as its explicit index, and the inclusive length of this and all adjacently matched characters as its implicit length (ie of the matched string), the sum of which is equivalent to the first position of the start next matching operation (ie the last index).

## Capturing

The overlapping abstract operation during a matching operation, whereby a portion of the pattern to be matched and the respective string of characters that satisfy that particular portion of the pattern are recorded onto the match record, implicitly by the relative index of the captured position in the pattern to be matched and where applicable also explicity as a named capture group. <!-- talk about last override -->
