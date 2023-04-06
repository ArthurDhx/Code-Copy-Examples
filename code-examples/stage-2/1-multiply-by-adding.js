const prompt = require('prompt-sync')({sigint: true});

const a = Number(prompt('enter a positive integer: '));
const b = Number(prompt('enter any number: '));

console.log(`${a}*${b} = ${a*b}`);

let result = 0;

// compute the multiple by a-times adding b

for (let i=0; i<a; i++) {
  result += b;
}

console.log(`${a}*${b} = ${result}`);

// the end
// what happens if you enter 1000 and 0.1 as a and b? why?
// what happens if you enter 3.2 and 1? why?
// what happens if you enter -3 and 3? why?
