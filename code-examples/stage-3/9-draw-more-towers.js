// this part of the program is the same as in the previous example

const prompt = require('prompt-sync')({ sigint: true });
const colors = require('colors/safe');

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

/*
 * word towers for the words "word" and "tower":
 *
 *       ww                   tt
 *      oooo                 oooo
 *     rrrrrr               wwwwww
 *    dddddddd             eeeeeeee
 *                        rrrrrrrrrr
 *
 * We can describe the tower for the word `word` as an array of layers,
 * where every item has `w` for width, and `ch` for the character.
 * [
 *   { w: 2, ch: "w" },
 *   { w: 4, ch: "o" },
 *   { w: 6, ch: "r" },
 *   { w: 8, ch: "d" },
 * ]
 */

function describeWordTower(word) {
  const retval = [];

  for (let i = 0; i < word.length; i += 1) {
    const character = word[i];
    const layerSize = (i + 1) * 2;
    const layerDescription = {
      w: layerSize,
      ch: character,
    };

    // push adds an item to the end of an array
    retval.push(layerDescription);
  }

  return retval;
}

/*
 * With a description like above, we can create a string for each layer.
 * For example, if we want our tower to be 10-wide, and we have a layer
 * { w: 2, ch: "w" }
 * then the result should be
 * "    ww    " (4 spaces, then a double w, then 4 spaces)
 */
function createLayerString(towerWidth, layerDescription) {
  const spaceCount = towerWidth - layerDescription.w;
  const sidePadding = ' '.repeat(spaceCount / 2);
  const characters = layerDescription.ch.repeat(layerDescription.w);
  return sidePadding + characters + sidePadding;
}

// here the program begins to differ again

const WIDTH = 20;
const EMPTY_LAYER = { w: 0, ch: ' ' };

function printTowersSideBySide(towers) {
  // find the height of the tallest tower
  let height = 0;
  for (const tower of towers) {
    // tower is an array of layers, so the array length is the tower height
    if (tower.length > height) height = tower.length;
  }

  // print `height` layers; shorter towers will start lower
  for (let i = 0; i < height; i += 1) {
    let layerString = '';

    // add each tower to the layerString
    for (const tower of towers) {
      const layerIndex = (tower.length - height) + i;
      if (layerIndex < 0) {
        // the tower hasn't started yet
        layerString += createLayerString(WIDTH, EMPTY_LAYER);
      } else {
        layerString += createLayerString(WIDTH, tower[layerIndex]);
      }
    }

    console.log(nthColor(i, layerString));
  }
}

const wordString = prompt('enter a few words: ');

// split the wordString on every space
const words = wordString.split(' ');

// map runs describeWordTower() on each word
const towerDescriptions = words.map(describeWordTower);

printTowersSideBySide(towerDescriptions);
