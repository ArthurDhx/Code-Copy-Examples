// given an array, this function puts it in reverse order
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

// test the function – we should see 3,2,1 and 4,3,2,1
console.log('test 123: ', reverseArray([1, 2, 3]));
console.log('test 1234: ', reverseArray([1, 2, 3, 4]));

// the end
// can you explain in writing why secondHalfItem
// is taken from position `arr.length - 1 - i`?
