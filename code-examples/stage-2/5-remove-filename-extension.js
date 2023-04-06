const prompt = require('prompt-sync')({sigint: true});

const fileName = prompt('enter a file name: ');

let foundLastDot = false;
let response = '';

// find the last dot, then copy the string before that into response
// notice the loop goes from the end of the file name string
for (let i=fileName.length - 1; i >= 0; i--) {
  if (!foundLastDot) {
    // we do not have the last dot yet
    if (fileName[i] === '.') {
      foundLastDot = true;
    }
  } else {
    // we have the last dot, so we copy every character
    response = fileName[i] + response;
  }
}

if (response === '') {
  // we never found a dot, or it was the first character
  console.log('file name does not have an extension: ', fileName);
} else {
  console.log('file name without extension: ', response);
}

// the end
// what happens if you enter "document.pdf" ?
// what happens if you enter "document.pdf.exe" ?
