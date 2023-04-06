const prompt = require('prompt-sync')({ sigint: true });

// reverseArray here is the same as in the previous example
function reverseArray(arr) {
  // go from the beginning of the array to the middle,
  // swap the item in the first half with an item in the second half

  for (let i = 0; i < arr.length / 2; i += 1) {
    const firstHalfItem = arr[i];
    const secondHalfItem = arr[arr.length - 1 - i];
    arr[i] = secondHalfItem;
    arr[arr.length - 1 - i] = firstHalfItem;
  }
  return arr;
}

function reverseString(str) {
  // Array.from() can make an array of characters from a string
  const array = Array.from(str);

  reverseArray(array);

  // Array.join() makes an array into a string
  return array.join('');
}

// check that the word is a palindrome by comparing it to its reverse
function isPalindrome(word) {
  return word === reverseString(word);
}

const word = prompt('enter a word: ');

if (isPalindrome(word)) {
  console.log(`"${word}" is a palindrome`);
} else {
  console.log(`"${word}" is not a palindrome, as its reverse spells ${reverseString(word)}`);
}
