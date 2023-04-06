const prompt = require('prompt-sync')({ sigint: true });

// return a random number between 1 and 6
function diceRoll() {
  const SIDES = 6;
  const side = Math.floor(Math.random() * SIDES) + 1;
  return side;
}

const count = Number(prompt('how many dice rolls would you like? '));

for (let i = 0; i < count; i += 1) {
  console.log(diceRoll());
}
