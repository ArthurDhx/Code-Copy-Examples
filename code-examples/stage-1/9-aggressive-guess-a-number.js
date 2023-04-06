const prompt = require('prompt-sync')({sigint: true});

const winningNumber = Math.floor(Math.random() * 10) + 1;

console.log("In my infinite wisdom,")
console.log("I have thought of an integer between 1 and 10.");

const guess = Number(prompt("Tell me what you think it is: "));

if (!Number.isInteger(guess) ) {
    console.log("Seriously... don't you know what an integer is? Come back when you've read a book on Maths.");
} else if (guess > 10 || guess < 1) {
    console.log("Duh, I told you it would be between 1 and 10. Curse your feeble organic brain!");
} else if (guess === winningNumber) {
    console.log("What? You got it? You must have cheated... Shame on you.");
} else {
    console.log("As I expected, I outwitted you. I was thinking of ", winningNumber);
    console.log("I retire undefeated.");
}
