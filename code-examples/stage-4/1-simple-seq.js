// This tool prints a sequence of numbers between the given two parameters.
// This file wants to be called seq.js

const first = Number(process.argv[2]);
const last = Number(process.argv[3]);

if (Number.isNaN(first) || Number.isNaN(last)) {
  console.error('Usage: node seq.js number number');
  process.exit(1);
}

for (let i = first; i <= last; i += 1) {
  console.log(i);
}

// the end
// what happens if you run node seq.js 10 1  ?
// can you make it handle both increasing and decreasing sequences?
// can you improve the program so that a third argument specifies the increment?
// e.g. running  node seq.js 1 9 2    should output 1,3,5,7,9
