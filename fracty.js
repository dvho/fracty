// FRACTY CONVERTS DECIMAL NUMBERS TO FRACTIONS BY ASSUMING THAT TRAILING PATTERNS FROM 10^-2 CONTINUE TO REPEAT
// The assumption is based on the most standard numbering conventions
// e.g. 3.51 will convert to 3 51/100 while 3.511 will convert to 3 23/45
// Throw any number up to 16 digits long at fracty and let fracy do the work.
// If number is beyond 16 digits fracty will truncate at 15 digits to compensate for roundoff errors created in IEEE 754 Floating Point conversion.

module.exports = function (number) { //IEEE 754 Floating Point conversion problems will cause entires above 16 digits to convert incorrectly to binary with small roundoff errors, so keeping entry below 16 digits will help fracy make the most accurate calculation. If there are 16 or more digits in the number fracty can be called on the decimal part of the number only to maximize accuracy.
    let type;

    if (number < 0) { //If number is less than zero it's negative.
        number = Math.abs(number);
        type = '-';
    } else {
        type = '';
    }

    if (number === undefined) {
        return `Your input was undefined.`
    }

    if (isNaN(number)) { //isNaN() instead of Number.isNaN() is used so that if fracty is called on something that is not a number but could be a string of numbers the function still passes as true.
        return `"${number}" is not a number.`;
    }

    if (number == 9999999999999999) { //There's no reason to call fracty on an integer at all, but in the unlikely case that the number is 9999999999999999 JavaScript will round to 10000000000000000 and fracty handles that. Interestingly, if fracty is called on -9999999999999999, which fracty converts to absolute value, the number logged is 10000000000000000 but the number stored is 9999999999999999, so this if statement works for both 9999999999999999 and -9999999999999999.
        return `${type}9999999999999999`;
    }

    if (number > 9999999999999999) { //Beyond 9999999999999999 IEEE 754 Floating Point conversion inaccuracies will occur in JavaScript.
        return `Too many digits in your integer to maintain IEEE 754 Floating Point conversion accuracy.`;
    }

    if (Number.isInteger(number)) { //If fracty is called on an integer, return the integer.
        return `${type}${number}`;
    }

    if (number < .000001) { //Non negative numbers with integers equal to zero that are followed by six or more consecutive zeros will coerce to scientific notation but, interestingly enough, numbers with integers that are not zero that are followed by six or more consecutive zeros will not coerce to scientific notation. Therefore, in the case of numbers with integers that are not zero that are followed by six or more consecutive zeros, fracty is more accurate than it is with numbers that have  integers equal to zero that are followed by six or more consecutive zeros because fracty doesn't have to coerce the decimal part of the number to '0' so soon. This it the smartest way fracty can compensate for this "bug" in JavaScript.
        return '0';
    }

    const numberString = number.toString();
    const entry = numberString.split('.');
    let integer = entry[0];
    let decimal;

    if (decimal == '0' && integer !== '0') { //If there's no decimal just return the integer.
        return integer;
    } else if (decimal == '0' && integer == '0') { //If only zero is entered return zero.
        return '0';
    } else if (numberString.length >= 17){ //If the number entered has equal to or more than 16 digits (decimal is excluded) truncate the last digit to prevent errors in IEEE 754 Floating Point conversion.
        decimal = entry[1].slice(0,entry[1].length-1);
    } else {
        decimal = entry[1];
    }

    if (decimal == '99' && integer !== '0') { //Otherwise it will automatically round to 1/1.
        return `${integer} 99/100`;
    } else if (decimal == '99' && integer == '0') {
        return `99/100`;
    } else if (1 - parseFloat(`.${decimal}`) < .0011) { //If decimal is at least .99899999999 assume that the fraction will inevitably result in 1/1, so circumnavigate the issue that .999, upon IEEE 754 Floating Point conversion, accidentally becomes .9989999999999997 by replacing it with '999', which fracty will further reduce properly.
        decimal = '999';
    }

    if (decimal == undefined) {
        return integer;
    }

    const decimalRev = decimal.split('').reverse().join(''); //Reverse the string to look for patterns.
    const patternSearch = /^(\d+)\1{1,2}/; //This greedy regex matches the biggest pattern that starts at the beginning of the string (at the end, in the case of the reversed string). A lazy regex doesn't work because it only identifies subpatterns in cases where subpatterns exist (e.g. '88' in '388388388388'), thus pattern capture must be greedy.
    let pattern = decimalRev.match(patternSearch); //If there's a pattern, it's full sequence is in [0] of this array and the single unit is in [1] but it may still need to be reduced further.

    if (pattern && decimal.length > 2) { //In keeping with the most standard numbering conventions of monetary divisibility, etc., if there's a pattern beyond two decimal places, reverse back the pattern that the greedy regex deemed a single unit, and the full pattern sequence, respectively.
        let patternSequence = pattern[0].split('').reverse().join('');
        let endPattern = pattern[1].split('').reverse().join('');

        if (endPattern.length > 1) { //Test to see if the pattern unit is actually a single repeating digit.
            let endPatternArray = endPattern.split('');
            let testSingleUnit = 1;
            for (let i = 0; i < endPatternArray.length; i++) {
                testSingleUnit /= endPatternArray[0]/endPatternArray[i];
            }

            if (testSingleUnit === 1 ) {
                endPattern = endPatternArray[0];
            }
          }

        if (endPattern.length > 1 && endPattern.length % 2 === 0) { //If what the greedy regex deems to be the pattern unit has a length greater than 1 and an even number of digits, check to see if splitting it in half will give two equal parts. If it does, one of those equal parts will be the pattern. There's no need repeat this test as no case needing this test more than once would exist for strings of 16 digits or less.
            endPattern = parseInt(endPattern.slice(0,endPattern.length/2),10) - parseInt(endPattern.slice(endPattern.length/2,endPattern.length),10) === 0 ? endPattern.slice(0,endPattern.length/2) : endPattern;
        }
            return yesRepeat(decimal, endPattern, patternSequence, integer, type); //Begin calculating the numerator and denominator for decimals that have a pattern.
        } else {
            return noRepeat(decimal, integer, type); //Begin calculating the numerator and denominator for decimals that don't have a pattern.
    }
}

  //IF THERE'S A TRAILING PATTERN FRACTY DIVIDES THE INPUT BY ONE SUBTRACTED FROM THE NEAREST BASE 10 NUMBER WITH NUMBER OF ZEROS EQUAL TO THE LENGTH OF THE REPEATED PATTERN (I.E. A SERIES OF 9'S) MULTIPLIED BY THE BASE 10 NUMBER GREATER THAN AND CLOSEST TO THE INPUT.
function yesRepeat(decimal, endPattern, patternSequence, integer, type) {

    const rep = true; //The numerator repeats.
    const nonPatternLength = decimal.length - patternSequence.length >= 1 ? decimal.length - patternSequence.length : 1; //Does the length of the non pattern segment of the input = 0? If it does, that's incorrect since we know it must equal at least 1, otherwise it's the length of the decimal input minus the length of the full pattern.
    const decimalMultiplier2 = Math.pow(10,(nonPatternLength)); //Second multiplier to use.
    const float = parseFloat(`0.${decimal}`); //Convert the decimal input to a floating point number.
    const decimalMultiplier1 = Math.pow(10,(endPattern.length)); //Find the right multiplier to use for both numerator and denominator, which will later have 1 subtracted from it in the case of the denominator.
    const numerator = Math.round(((float * decimalMultiplier1) - float) * Math.pow(10,(nonPatternLength))); //Find the numerator to be used in calculating the fraction that contains a repeating trailing sequence.
    const denominator = (decimalMultiplier1-1) * decimalMultiplier2; //Caluculate the denominator using the equation for repeating trailing sequences.
    return reduce(numerator, denominator, integer, type, rep); //Further reduce the numerator and denominator.
}

//IF THERE'S NO TRAILING PATTERN FRACTY DIVIDES THE INPUT BY THE NEAREST BASE 10 INTEGER GREATER THAN THE NUMERATOR.
function noRepeat(decimal, integer, type) {
    const rep = false; //The numerator doesn't repeat.
    const numerator = parseInt(decimal, 10); //Numerator begins as decimal input converted into an integer.
    const denominator = Math.pow(10,(decimal.length)); //Denominator begins as 10 to the power of the length of the numerator.
    return reduce(numerator, denominator, integer, type, rep); //Reduce the numerator and denominator.
}

//FRACTY REDUCES THE FRACTION.
function reduce(numerator, denominator, integer, type, rep) {

    const primeNumberArray = [2, 3, 5]; //If the numerator isn't from a repeating decimal case, the initialized array of prime numbers will suffice to find the common denominators.

    if (rep === true) {  //If the numerator is from a repeating decimal case, fracty generates an array of prime numbers from 2 to the square root of the numerator, loops over the array to find the common denominators, and reduces the fraction. Since reducing by prime numbers beyond i^2 isn't necessary, fracty creates and array of the prime numbers that, when squared, are still less than or equal to the numerator.
        for (let i = 3; i * i <= numerator; i+=2) {
            if (numerator % i === 0) {
                primeNumberArray.push(i);
            }
        }
    }

    let j = 0; //Initialize counter over the prime number array for the while loop.
    let comDenom = 1; //Initialize the common denominator.
    let num = numerator; //Initialize the numerator.
    let den = denominator; //Initialize the denominator.

    while (j <= primeNumberArray.length) { //While i is less than the length of the array of prime numbers, check divisibility for both numerator and denominator and if there's a common denominator, divide it by that prime number and continue until they no longer reduce and you have to check the next prime number in the array.
        if (num % primeNumberArray[j] === 0 && den % primeNumberArray[j] === 0) {
            comDenom = comDenom * primeNumberArray[j];
            num = num/primeNumberArray[j];
            den = den/primeNumberArray[j];
        } else {
            j++;
        }
    }

    return returnStrings(den, num, integer, type);
}

//FRACTY RETURNS THE REDUCED FRACTION AS A STRING.
function returnStrings (den, num, integer, type) {

    if (den === 1 && num === 1) { //If '1/1'
        integer = `${type}${(parseInt(integer) + 1).toString()}`; //Add 1 to the integer and return a string without a fraction.
        return `${integer}`;
    } else if (num === 0) { //This happens when there are >=15 zeros in the decimal part of your number and the number has an integer part that is not zero and so doesn't coerce to scientific notation.
        return `${type}${integer}`;
    } else if (integer == '0') { //If the integer is '0' just return the fraction.
        return `${type}${num}/${den}`;
    } else {
        return `${type}${integer} ${num}/${den}`; //If there's an integer and a fraction return both.
    }

}
