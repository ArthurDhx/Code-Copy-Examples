const prompt = require('prompt-sync')({sigint: true});

const count = Number(prompt('how many words? '));

const words = [
  'aliqua', 'laboris', 'quid', 'possumus', 'adipisicing',
];

// we don't know yet how to capitalize a string,
// so we have extra starting words
const startingWords = [
  'Summis', 'Eiusmod', 'Ab', 'Aute',
];

const sentenceEndings = [ ".", "?", "!" ];

let response = "";
let startingNewSentence = true;

for (let i=0; i<count; i++) {
  if (startingNewSentence) {
    const randomNumber = Math.floor(Math.random() * startingWords.length);
    response = response + startingWords[randomNumber];
    startingNewSentence = false;
  } else {
    const randomNumber = Math.floor(Math.random() * words.length);
    response = response + words[randomNumber];
  }

  // 20% of words will end the sentence
  // the last word will also end the sentence
  if (Math.random() < 0.2 || i === count-1) {
    const randomNumber = Math.floor(Math.random() * sentenceEndings.length);
    response = response + sentenceEndings[randomNumber];
    startingNewSentence = true;
  }

  // always add a space before we move on to the next word
  response = response + " ";
}

console.log(response);
