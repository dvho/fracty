# Fracty
[_Fracty_](https://www.npmjs.com/package/fracty) is a decimal-to-fraction conversion module that solves the many well known problems with decimal-to-fraction conversion modules. Those common problems include overlooking conversion inaccuracies in the IEEE Standard for Floating-Point Arithmetic (IEEE 754), mishandling numbers with trailing repeat patterns, and incorrect or partial pattern recognition.

<img src="https://user-images.githubusercontent.com/45696445/51096139-5a54aa80-1788-11e9-9555-c1ec0635f483.gif">

_________________________
## API
### fracty(`number`)
```js
var fracty = require('fracty');

```
&nbsp;
_________________________
#### -- Example 1 --
```js
console.log(fracty(6.9024390243902));
```
> Output will be:
```
6 37/41
```
_________________________
&nbsp;
&nbsp;
_________________________
#### -- Example 2 --
```js
console.log(fracty(4.285714285714));
```
> Output will be:
```
4 2/7
```
_________________________
&nbsp;
&nbsp;
_________________________
#### -- Example 3 --
```js
console.log(fracty(-1.1425));
```
> Output will be:
```
-1 57/400
```
_________________________
&nbsp;
## Notes
[_Fracty_](https://www.npmjs.com/package/fracty) simply takes one argument, a number without any rounding and, in keeping with the most standard numbering conventions of monetary divisibility, etc., imagines that any trailing repeating patterns beyond two decimal places continue infinitely, and returns that input as a string of the fully reduced fraction equivalent.

## Installation
With [npm](http://npmjs.org) do
```bash
$ npm install fracty
```

## License
(MIT)

Copyright (c) 2018 David H. &lt;email6@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
