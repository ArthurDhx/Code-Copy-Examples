// This tool reverses a text file:
// it will write into the output file the contents
// of the input file reversed character by character.
// This file wants to be called rev.js

const fs = require('fs');

if (process.argv.length !== 4) {
  console.error('Usage: node rev.js inputfile outputfile');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const fileContents = fs.readFileSync(inputFile, 'utf-8');

// we can use Array reverse() to do our job here
const characters = Array.from(fileContents);
const reversed = characters.reverse();

// join('') put the array back together as a string
fs.writeFileSync(outputFile, reversed.join(''));

// the end
// Can you do the same without Array reverse()?
// Can you make the `outputfile` argument optional?
//   If the outputfile argument is not provided,
//   the program should just ouput with console.log()
//   instead of writing a file.
