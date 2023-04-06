const prompt = require('prompt-sync')({sigint: true});

const number = Number(prompt('enter a number: '));

if (Number.isInteger(number)) {
  console.log(number, 'is integer');
} else {
  console.log(number, 'is fractional');
}

// the end
// try how the program reacts if what
// you give it is not a number
