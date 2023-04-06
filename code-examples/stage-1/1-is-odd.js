const prompt = require('prompt-sync')({sigint: true});

const number = Number(prompt('enter a number: '));

if (number % 2 === 0) {
  console.log(number, 'is even');
} else {
  console.log(number, 'is odd');
}

// the end
// try what the program does if you
// give it a fraction, e.g. 3.14
