const prompt = require('prompt-sync')({sigint: true});

// array of objects, each has a name and a nick
const knownPeople = [
  {
    name: "Matt Dennis",
    nick: "Dr Matt",
  },
  {
    name: "Rich Boakes",
    nick: "Dr Rich",
  },
  {
    name: "Jacek Kopecký",
    nick: "Dr Jack",
  },
];

let command;

do {
  console.log();
  command = prompt("Enter command (or enter 'help'): ");
  if (command === "help") {
    console.log("available commands:");
    console.log("  help    print this help");
    console.log("  stop    exit the program");
    console.log("  count   show how many persons we know")
    console.log("  add     add a person");
    console.log("  nick    search by nick");
    console.log("  name    search by name");
  }

  if (command === 'count') {
    console.log(`Record count: ${knownPeople.length}`);
  }

  if (command === 'add') {
    const name = prompt("name: ");
    const nick = prompt("nick: ");

    const newPerson = {};
    newPerson.name = name;
    newPerson.nick = nick;

    // add the new person at the end of the array
    knownPeople[knownPeople.length] = newPerson;
    console.log(`Added ${name}, new record count: ${knownPeople.length}`);
  }

  if (command === 'nick') {
    const nick = prompt("nick to search for: ");
    for (const person of knownPeople) {
      if (person.nick.includes(nick)) {
        console.log(`"${person.name}" has nick "${person.nick}"`);
      }
    }
  }

  if (command === 'name') {
    const name = prompt("name to search for: ");
    for (const person of knownPeople) {
      if (person.name.includes(name)) {
        console.log(`"${person.name}" has nick "${person.nick}"`);
      }
    }
  }
} while (command !== "stop");
