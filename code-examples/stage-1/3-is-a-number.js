const prompt = require('prompt-sync')({sigint: true});

const number = prompt('enter a number: ');

if (!Number.isNaN(Number(number))) {
  console.log(number, 'is a number');
} else {
  console.log(number, 'is not a number');
}
