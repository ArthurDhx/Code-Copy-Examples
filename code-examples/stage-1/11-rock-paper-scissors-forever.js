// use arrays and objects to simplify rock-paper-scissors

const prompt = require('prompt-sync')({sigint: true});

const CHOICES = [ 'rock', 'paper', 'scissors' ];

const LOSING_CHOICE = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

let userChoice;

do {
  const randomNumber = Math.floor(Math.random() * 3);
  const computerChoice = CHOICES[randomNumber];

  userChoice = prompt('enter your choice (rock, paper, scissors) or the word "stop": ');

  if (userChoice !== 'stop') {
    // check that the user has input a valid choice
    if (!CHOICES.includes(userChoice)) {
      console.error('Sorry, the only options are rock, paper and scissors.');
      console.error('Try again.');
    }

    if (userChoice === computerChoice) {
      console.log("it's a draw, we both have", userChoice);
    } else if (LOSING_CHOICE[userChoice] === computerChoice) {
      console.log(`you win with ${userChoice} over ${computerChoice}`);
    } else {
      console.log(`I win with ${computerChoice} over ${userChoice}`);
    }
  }
} while (userChoice !== 'stop');

console.log('thank you for the good game!');

// the end
// can you add counters for wins, losses, and draws,
// and report them after the user says to stop?
