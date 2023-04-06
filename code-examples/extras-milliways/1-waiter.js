const prompt = require('prompt-sync')({ sigint: true });

const PARTY_SIZE = 8;
const TABLE_COUNT = 1000;

function printGreeting() {
  console.log('                Welcome');
  console.log('                  to');
  console.log('               Milliways!');
  console.log('(The Restaurant at The End of The Universe)');
  console.log();
  console.log(`Parties of up to ${PARTY_SIZE} can dine together.`);
  console.log('       Please use this app to order.');
  console.log();
}

function sendOrderToKitchen(tableOrder) {
  console.log('The order is:', tableOrder);
}

function promptForNumber(msg, limit) {
  let numberEntered;

  do {
    numberEntered = Number(prompt(msg + `(up to ${limit}) `));
    if (numberEntered > limit) {
      console.log('please enter a number up to', limit);
    }
  } while (numberEntered > limit);

  return numberEntered;
}

function gatherOneOrder(dinerNumber, tableOrder) {
  const starter = prompt(`#${dinerNumber}, what would you like to start? `);
  const main = prompt('...and for your main course? ');

  const dinerOrder = {};
  if (starter !== '') dinerOrder.starter = starter;
  if (main !== '') dinerOrder.main = main;
  if (main !== '' || starter !== '') tableOrder.food.push(dinerOrder);

  const drink = prompt('...and what would you like to drink? ');
  if (drink !== '') tableOrder.drinks.push(drink);
}

function gatherTableOrder() {
  const tableOrder = {
    table: promptForNumber('What is your table number? ', TABLE_COUNT),
    diners: promptForNumber('How many in your party? ', PARTY_SIZE),
    food: [],
    drinks: [],
  };

  for (let i = 1; i <= tableOrder.diners; i += 1) {
    gatherOneOrder(i, tableOrder);
  }

  return tableOrder;
}

printGreeting();
const order = gatherTableOrder();
sendOrderToKitchen(order);
