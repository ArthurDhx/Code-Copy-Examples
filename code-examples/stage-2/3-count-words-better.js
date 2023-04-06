const prompt = require('prompt-sync')({sigint: true});

const sentence = prompt("Enter a sentence: ");

let wordCount = 0;

// go through the string, keeping track of context
let foundFirstWord = false;
let previousWasSpace = false;

for (let i=0; i<sentence.length; i++) {
  if (!foundFirstWord) {
    // before the first word, just look for a non-space
    if (sentence[i] !== ' ') {
      foundFirstWord = true;
      wordCount = 1;
    }
  } else {
    // we have seen the first word
    // add a word if we are on a non-space that had a space before
    if (sentence[i] !== ' ' && previousWasSpace) {
      wordCount += 1;
      previousWasSpace = false;
    }
    if (sentence[i] === ' ') {
      // remember for the next character that the previous was a space
      previousWasSpace = true;
    }
  }
}

console.log("Word count:", wordCount);

// the end
// what happens when you enter "this is cool - even great!"?
// what should a good word-counting program return?
