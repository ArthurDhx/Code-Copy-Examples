const prompt = require('prompt-sync')({sigint: true});

const firstInput = prompt('enter something: ');
const secondInput = prompt('enter something: ');

console.log(firstInput + secondInput);
