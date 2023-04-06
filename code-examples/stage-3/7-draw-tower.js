const prompt = require('prompt-sync')({ sigint: true });

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

const WIDTH = 20;

const word = prompt('enter a word: ');
const towerDescription = describeWordTower(word);
for (const layer of towerDescription) {
  console.log(createLayerString(WIDTH, layer));
}
