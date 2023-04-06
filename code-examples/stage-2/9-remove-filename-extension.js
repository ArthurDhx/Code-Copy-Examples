const prompt = require('prompt-sync')({sigint: true});

const fileName = prompt('enter a file name: ');

const lastDotPosition = fileName.lastIndexOf('.');

if (lastDotPosition < 1) {
  console.log('file name does not have an extension: ', fileName);
} else {
  const withoutExtension = fileName.substring(0, lastDotPosition);
  console.log('file name without extension: ', withoutExtension);
}

// the end
// have you noticed what happens for names like "file." ?
