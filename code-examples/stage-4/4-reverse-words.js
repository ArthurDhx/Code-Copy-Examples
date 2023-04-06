// This tool reverses each word in a text file.
// This file wants to be called rev-words.js

const fs = require('fs');

if (process.argv.length !== 3) {
  console.error('Usage: node rev-words.js file');
  process.exit(1);
}

function reverse(string) {
  return Array.from(string).reverse().join('');
}

const fileName = process.argv[2];

const fileContents = fs.readFileSync(fileName, 'utf-8');

const lines = fileContents.split('\n');

for (const line of lines) {
  const words = line.split(' ');

  const reversedWords = [];
  for (const word of words) {
    reversedWords.push(reverse(word));
  }
  console.log(reversedWords.join(' '));
}

// the end
// As practice, add an optional outputfile argument
// and if that's provided, output into the file.
// Hint: there is a function appendFileSync in the fs module.
