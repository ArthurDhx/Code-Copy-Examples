const prompt = require('prompt-sync')({ sigint: true });

// diceRoll here is the same as in the previous example
function diceRoll() {
  const SIDES = 6;
  const side = Math.floor(Math.random() * SIDES) + 1;
  return side;
}

// gatherDiceRollHistory here is the same as in the previous example
function gatherDiceRollHistory(n) {
  // store how many times we rolled a given number
  const history = [0, 0, 0, 0, 0, 0];

  for (let i = 0; i < n; i += 1) {
    const roll = diceRoll();
    history[roll - 1] += 1;
  }

  return history;
}

// return the largest element in an array
function max(arr) {
  let max = arr[0];
  for (const item of arr) {
    if (item > max) max = item;
  }
  return max;
}

const attempts = Number(prompt('how many times should we roll? '));

const history = gatherDiceRollHistory(attempts);

// draw lines for each number,
// 20 characters maximum for the longest line
const LINE_LENGTH = 20;

const maxCount = max(history);
for (let i = 1; i <= 6; i += 1) {
  const lineLength = Math.round(history[i - 1] / maxCount * LINE_LENGTH);

  const line = '#'.repeat(lineLength);
  console.log(`${i}: ${line}`);
}
