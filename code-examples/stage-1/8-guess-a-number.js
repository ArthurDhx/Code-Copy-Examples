const prompt = require('prompt-sync')({sigint: true});

const randomNumber = Math.floor(Math.random() * 10) + 1;
const userGuess = Number(prompt("Enter a number: "));

if (randomNumber === userGuess) {
  console.log('correct!');
} else {
  console.log('sorry, I was thinking', randomNumber);
}
