const prompt = require('prompt-sync')({ sigint: true });

// returns true if `n` is a prime number
// and false for all other values of `n`
function isPrime(n) {
  // a prime must be an integer of at least 1
  if (!Number.isInteger(n) || n < 1) return false;

  // a number is prime if it is only divisible by 1 and itself

  // take `i` from 2 to `n-1`
  for (let i = 2; i < n; i += 1) {
    // whenever `n` is divisible by `i` it's not prime
    if (n % i === 0) return false;
  }

  // if we reach here then `n` is a positive integer divisible
  // by nothing but 1 and itself
  return true;
}

function printPrimes(count) {
  let currentNumber = 2;
  while (count > 0) {
    if (isPrime(currentNumber)) {
      console.log(`prime: ${currentNumber}`);

      // we've printed a number, need to print one fewer numbers now
      count -= 1;
    }

    // try the next bigger number
    currentNumber += 1;
  }
}

const count = Number(prompt('how many prime numbers would you like? '));
printPrimes(count);
