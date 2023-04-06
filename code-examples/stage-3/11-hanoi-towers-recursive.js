// this example varies from the previous one only in that it removes
// the moveTwoBlocks, moveThreeBlocks, and moveFourBlocks functions
// and replaces them with a recursive version (moveBlocks)

/*
 * Tower of Hanoi is a simple puzzle game, this program automatically solves it and
 * shows the solution step by step.
 *
 * In this puzzle game we have three spaces: the first space contains
 * a tower of differently sized blocks, bigger always placed below smaller,
 * and initially the other two spaces are empty.
 *
 *       ##
 *      ####
 *     ######
 *    space #1   space #2   space #3
 *
 * In every move, the player can move only the top block from the tower
 * on one of the three spaces, and place it on a bigger block on the towers
 * on the other two spaces.
 *
 * For example, the first possible move is to take the top block from space 1
 * and move it to space 2 or 3, so it can look like this:
 *
 *
 *      ####
 *     ######       ##
 *    space #1   space #2   space #3
 *
 * Then the player can take the top block from space 1 and place it on space 3, but
 * it's not allowed to place it on space 2 because the block below it would be smaller.
 *
 * The ultimate goal is to move the whole tower to space 3, so it looks like this:
 *
 *                             ##
 *                            ####
 *                           ######
 *    space #1   space #2   space #3
 *
 *
 *
 * In the program, the towers are like word towers, but we can just
 * describe the layers as strings here. It is a simplification over how the
 * previous code examples did it. We do add tower names, though.
 *
 * A tower like this:
 *
 *     ##
 *    ####
 *   ######
 *  space #1
 *
 * is described as
 * {
 *   name: 'space #1',
 *   layers: [
 *     '   ##   ',
 *     '  ####  ',
 *     ' ###### ',
 *   ],
 * }
 * The code below adds colors, too.
 */

const prompt = require('prompt-sync')({ sigint: true });
const colors = require('colors/safe');

const HEIGHT = 4;
const WIDTH = HEIGHT * 2 + 2;
const EMPTY_LAYER = padLayerString(WIDTH, '');

// color a string with n-th color from the array below
function nthColor(n, string) {
  const colorFunctions = [
    colors.red,
    colors.green,
    colors.yellow,
    colors.blue,
    colors.magenta,
    colors.cyan,
  ];

  const selectedColorFunction = colorFunctions[n % colorFunctions.length];

  return selectedColorFunction(string);
}

function describeHanoiTower() {
  const tower = [];

  for (let i = 0; i < HEIGHT; i += 1) {
    const layerSize = (i + 1) * 2;
    const layer = padLayerString(WIDTH, '#'.repeat(layerSize));

    // push adds an item to the end of an array
    tower.push(nthColor(i, layer));
  }

  return tower;
}

/*
 * With a an array of layers, we can pad each layer so it's a specified width long.
 * For example, if we want our tower to be 10-wide, and we have a layer '##',
 * then the result should be
 * "    ##    " (4 spaces, then ##, then 4 spaces)
 */
function padLayerString(towerWidth, layer) {
  const spaceCount = towerWidth - layer.length;
  const sidePadding = ' '.repeat(spaceCount / 2);
  return sidePadding + layer + sidePadding;
}

function printTowersSideBySide(spaces) {
  // print `height` layers; shorter towers will start lower
  for (let i = 0; i < HEIGHT; i += 1) {
    let layerString = '';

    // add each tower to the layerString
    for (const tower of spaces) {
      const layerIndex = (tower.layers.length - HEIGHT) + i;
      // use empty layer if the tower hasn't started yet
      layerString += layerIndex < 0 ? EMPTY_LAYER : tower.layers[layerIndex];
    }

    console.log(layerString);
  }

  // print space names
  let nameLine = '';
  for (const tower of spaces) {
    nameLine += padLayerString(WIDTH, tower.name);
  }
  console.log(nameLine);
}

// crate the default towers and then play the game automatically
function playTowerOfHanoi() {
  // create the spaces, the first one has a tower and the other two are empty
  const spaces = [
    {
      name: 'space #1',
      layers: describeHanoiTower(),
    },
    {
      name: 'space #2',
      layers: [],
    },
    {
      name: 'space #3',
      layers: [],
    },
  ];

  // show the starting state
  printTowersSideBySide(spaces);

  // do the actual moves
  moveBlocks(spaces[0], spaces[2], spaces[1], HEIGHT);
  console.log('done');

  // below, we define the helpful functions from the easiest one
  // they are defined inside the playTowerOfHanoi function block
  // so that moveOneBlock has access to the `spaces` variable and can print the current state

  // move the top-most block from the `from` space to the `to` space
  function moveOneBlock(from, to) {
    // report the move
    console.log(); // extra line for spacing
    console.log(`will move block from ${from.name} to ${to.name}`);

    // wait for the user to press enter so they can watch the steps one by one
    prompt('press enter... ');

    // the top-most block is in from.layers[0]; shift() will remove it
    const block = from.layers.shift();
    to.layers.unshift(block);

    // show the spaces and the towers after the move
    printTowersSideBySide(spaces);
  }

  // move any number blocks from the `from` space, onto the `to` space,
  // using the `through` space for intermediate steps
  function moveBlocks(from, to, through, howMany) {
    // we don't need to do anything when asked to move 0 blocks
    if (howMany > 0) {
      // move all-but-one blocks out of the way, then move one
      // calling moveBlocks from inside moveBlocks is called recursion
      moveBlocks(from, through, to, howMany - 1);
      moveOneBlock(from, to);
      moveBlocks(through, to, from, howMany - 1);
    }
  }
}

playTowerOfHanoi();

// the end
// what happens in this version when we increase HEIGHT to 5?
// what happens if we remove the condition  if (howMany > 0) inside moveBlocks?
