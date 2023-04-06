// This tool prints a sequence of numbers,
// up to the given last number,
// with an optional first and increment.
// This file wants to be called incr.js

let first, incr, last;

if (process.argv.length === 3) {
  // if we don't specify first and incr, they default to 1
  first = 1;
  incr = 1;
  last = Number(process.argv[2]);
} else if (process.argv.length === 4) {
  first = Number(process.argv[2]);
  incr = 1;
  last = Number(process.argv[3]);
} else if (process.argv.length === 5) {
  first = Number(process.argv[2]);
  incr = Number(process.argv[3]);
  last = Number(process.argv[4]);
}

if (last == null || Number.isNaN(first) || Number.isNaN(incr) || Number.isNaN(last)) {
  console.error('Usage: node incr.js [first [incr]] last');
  process.exit(1);
}

for (let i = first; i <= last; i += incr) {
  console.log(i);
}

// the end
// what happens if you run  node incr.js 1 -1 10  ?
// what happens if you run  node incr.js 10 -1 1  ?
// if it goes forever, stop it with ctrl-c
// can you make it not fail?
