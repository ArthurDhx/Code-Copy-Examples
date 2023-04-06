const prompt = require('prompt-sync')({sigint: true});

const randomNumber = Math.random();

let computerChoice;

if (randomNumber < 1/3) {
  computerChoice = 'rock';
} else if (randomNumber < 2/3) {
  computerChoice = 'paper';
} else {
  computerChoice = 'scissors';
}

const userChoice = prompt('enter your choice (rock, paper, scissors): ');

if (userChoice === computerChoice) {
  console.log("it's a draw, we both have", userChoice);
} else if (userChoice === "rock") {
  if (computerChoice === "paper") {
    console.log("I win with paper over rock");
  } else {
    // computer has scissors
    console.log("you win with rock over scissors");
  }
} else if (userChoice === "paper") {
  if (computerChoice === "rock") {
    console.log("you win with paper over rock");
  } else {
    // computer has scissors
    console.log("I win with scissors over paper");
  }
} else {
  // user has scissors
  if (computerChoice === "paper") {
    console.log("you win with scissors over paper");
  } else {
    // computer has rock
    console.log("I win with rock over scissors");
  }
}
