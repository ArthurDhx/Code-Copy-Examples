const prompt = require('prompt-sync')({sigint: true});

const input = prompt('enter something: ');

console.log(input.length);
