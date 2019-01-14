const fr = require('./fracty.js');

console.log('Starting tests');

const NaNInputs = fr('Hello');
if (NaNInputs !== '"Hello" is not a number.') {
    throw new Error('fr not recognizing non numbers');
}

const undefinedInputs = fr(undefined);
if (undefinedInputs !== 'Your input was undefined.') {
    throw new Error('fr not recognizing non numbers');
}

const floatingPointErrorHandling1 = fr(-9999999999999999);
if (floatingPointErrorHandling1 !== '-9999999999999999') {
    throw new Error('fr not buffering against IEEE 754 Floating Point conversion inaccuracies');
}

const floatingPointErrorHandling2 = fr(9999999999999999);
if (floatingPointErrorHandling2 !== '9999999999999999') {
    throw new Error('fr not buffering against IEEE 754 Floating Point conversion inaccuracies');
}

const floatingPointErrorHandling3 = fr(10000000000000000);
if (floatingPointErrorHandling3 !== '9999999999999999') {
    throw new Error('JavaScript is behaving oddly, not coercing 10000000000000000 to 9999999999999999 before storing the variable');
}

const floatingPointErrorHandling4 = fr(11000000000000000);
if (floatingPointErrorHandling4 !== 'Too many digits in your integer to maintain IEEE 754 Floating Point conversion accuracy.') {
    throw new Error('fr not buffering against IEEE 754 Floating Point conversion inaccuracies');
}

const floatingPointErrorHandling5 = fr(.999899999999);
if (floatingPointErrorHandling5 !== '1') {
    throw new Error('JavaScript is behaving oddly, not coercing .999899999999 to 1 before storing the variable');
}

const integerHandling1 = fr(5473);
if (integerHandling1 !== '5473') {
    throw new Error('fr not properly handling integers');
}

const integerHandling2 = fr(5473.00);
if (integerHandling2 !== '5473') {
    throw new Error('fr not properly handling integers');
}

const integerHandling3 = fr(5473.);
if (integerHandling3 !== '5473') {
    throw new Error('fr not properly handling integers');
}

const tooSmall = fr(.0000009);
if (tooSmall !== '0') {
    throw new Error('fr not properly handling numbers < .000001');
}

const zero1 = fr(0);
if (zero1 !== '0') {
    throw new Error('fr not properly handling 0');
}

const zero2 = fr(0.0);
if (zero2 !== '0') {
    throw new Error('fr not properly handling 0');
}

const zero3 = fr(.0);
if (zero3 !== '0') {
    throw new Error('fr not properly handling 0');
}

const zero4 = fr(0.);
if (zero4 !== '0') {
    throw new Error('fr not properly handling 0');
}

const repeats1 = fr(.6666666666666666);
if (repeats1 !== '2/3') {
    throw new Error('fr not properly identifying single digit repeats');
}

const repeats2 = fr(.388388388388388);
if (repeats2 !== '388/999') {
    throw new Error('fr might not be properly identifying and accounting for subpatterns');
}

const repeats3 = fr(.388388388388);
if (repeats3 === '6990990991/18000000000') {
    throw new Error('fr not properly identifying and accounting for subpatterns');
}

const repeats4 = fr(.77);
if (repeats4 === '7/9') {
    throw new Error('fr recognizing patterns too early.')
}

const repeats5 = fr(.142857142857142857);
if (repeats5 !== '1/7') {
    throw new Error('fr not recognizing repeat patterns.')
}

const repeats6 = fr(.142857142857142);
if (repeats6 !== '1/7') {
    throw new Error('fr not recognizing broken repeat patterns.')
}

const nonRepeats1 = fr(45.54345698);
if (nonRepeats1 !== '45 27172849/50000000') {
    throw new Error('fr not properly reducing non repeating numbers.')
}

const nonRepeats2 = fr(5.567445);
if (nonRepeats2 !== '5 113489/200000') {
    throw new Error('fr not properly reducing non repeating numbers.')
}
