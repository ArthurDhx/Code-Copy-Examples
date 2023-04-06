const prompt = require('prompt-sync')({sigint: true});

const count = Number(prompt('how many words? '));

const words = [
  'aliqua', 'laboris', 'quid', 'possumus', 'adipisicing',
];

let response = "";

for (let i=0; i<count; i++) {
  const randomNumber = Math.floor(Math.random() * words.length);
  response = response + words[randomNumber] + " ";
}

console.log(response);

// the end
// what do you need to change to add more variety to the words?
