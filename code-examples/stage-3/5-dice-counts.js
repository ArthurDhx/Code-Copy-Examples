const prompt = require('prompt-sync')({ sigint: true });

// diceRoll here is the same as in the previous example
function diceRoll() {
  const SIDES = 6;
  const side = Math.floor(Math.random() * SIDES) + 1;
  return side;
}

// roll the dice n times, return an array of how many times each result was rolled
// the array starts at 0
// eslint-disable-next-line no-unused-vars
function gatherDiceRollHistory(n) {
  // store how many times we rolled a given number
  const history = [0, 0, 0, 0, 0, 0];

  for (let i = 0; i < n; i += 1) {
    const roll = diceRoll();
    history[roll - 1] += 1;
  }

  return history;
}

// turn a fraction into percentage with one decimal digit, like 0.1234 to 12.3%
function toPercent(n) {
  const percent = (n * 100).toFixed(1);
  return `${percent}%`;
}

const attempts = Number(prompt('how many times should we roll? '));

const history = gatherDiceRollHistory(attempts);

for (let i = 1; i <= 6; i += 1) {
  const chance = history[i - 1] / attempts;
  console.log(`Number ${i} chance: ${toPercent(chance)}`);
}
