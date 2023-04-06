const prompt = require('prompt-sync')({sigint: true});

const firstNumber = Number(prompt('enter a number: '));
const secondNumber = Number(prompt('enter a number: '));

console.log(firstNumber + secondNumber);
