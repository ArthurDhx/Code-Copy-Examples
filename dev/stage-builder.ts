import * as fm from './file-management.js';
import * as parser from '../dev/description-parser.js';
import config from '../config.json';

main().catch(console.error);

async function main() {
  const stages = await fm.listStageFolders();
  for (const stage of stages) {
    const descriptionFiles = await fm.listStageMetadataFiles(stage);
    if (descriptionFiles.length !== 0) {
      const orderedFiles = orderDescriptionFiles(descriptionFiles);
      console.log(orderedFiles);
      const fileContent = await getFileContent(orderedFiles, stage);
      await fm.saveStagePage(stage, fileContent);
    }
  }
}

function orderDescriptionFiles(descriptionFiles: string[]) {
  const orderedFiles: string[] = [];
  for (const descriptionFile of descriptionFiles) {
    if (descriptionFile !== 'index.md') {
      orderedFiles[parseInt(descriptionFile.substring(0, descriptionFile.indexOf('-'))) - 1] = descriptionFile;
    }
  }
  if (descriptionFiles.includes('index.md')) {
    orderedFiles.push('index.md');
  }
  return orderedFiles;
}

async function getFileContent(descriptionFiles: string[], stage: string) {
  let fileContent = '';
  if (descriptionFiles.includes('index.md')) {
    fileContent = await HtmlStart(stage);
    descriptionFiles.pop();
  }
  fileContent += '<section class="examples">\n\n';
  for (const htmlExample of await getHtmlExamples(descriptionFiles, stage)) {
    fileContent += htmlExample;
  }
  fileContent += '</section>\n\n' + '<script type=module src="../js/authentication.js"></script>\n';
  return fileContent;
}

async function HtmlStart(stage: string) {
  const index = (await fm.readStageSourceFile(stage, 'index.md')).toString();
  const indexData = parser.parseStageMetadataFile(index);
  let htmlStart = '<!doctype html>\n' +
  '<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<meta name="google-signin-client_id" content="' + config.clientId + '">\n' +
  '<script src="https://apis.google.com/js/platform.js" async defer></script>\n' +
  '<title>' + indexData.title + '</title>\n\n' +
  '<link rel="stylesheet" href="../style.css">\n\n' +
  '<a href="../index.html">Index</a>\n\n' +
  '<h1>' + indexData.title + '</h1>\n\n' +
  '<div class="g-signin2" data-onsuccess="onSignIn"></div>\n' +
  '<a id="signout" class="hidden" href="#">Sign out</a>\n\n' +
  '<p id="errorUser" class="error">You are not registered and cannot track your progress</p>\n\n';

  if (indexData.description) {
    htmlStart += indexData.description + '\n\n';
  }

  if (indexData.docLinks.length !== 0) {
    htmlStart += '<section>\n  <h2>Links to documentation</h2>\n  <ul>\n';
    for (const docLink of indexData.docLinks) {
      htmlStart += '    <li><a href="' + docLink.href + '">' + docLink.html + '</a></li>\n';
    }
    htmlStart += '  </ul>\n</section>\n\n';
  }

  return htmlStart;
}

async function getHtmlExamples(descriptionFiles: string[], stage: string) {
  const htmlExamples: string[] = [];
  for (const descriptionFile of descriptionFiles) {
    const fileContent = (await fm.readStageSourceFile(stage, descriptionFile)).toString();
    const fileData = parser.parseExampleMetadataFile(fileContent);

    let htmlContent = '';

    if (fileData.metadata.extraHeading) {
      htmlContent = '<h1>' + fileData.metadata.extraHeading + '</h1>\n\n';
    }

    htmlContent += '<section data-stage="' + stage + '" data-example="' + descriptionFile + '">\n  <h2>' + fileData.title + '  <input class="checkbox hidden" type="checkbox"></h2>\n';
    if (fileData.preHTML) {
      htmlContent += '  ' + fileData.preHTML + '\n';
    }
    htmlContent += '  <img alt="' + fileData.imageAlt + '" src="../img/' + stage + '-' + descriptionFile.substring(0, descriptionFile.lastIndexOf('.')) + '.png">\n';
    if (fileData.postHTML) {
      htmlContent += '  ' + fileData.postHTML + '\n';
    }

    if (fileData.extras.length !== 0) {
      htmlContent += '  <h3>Extra challenges</h3>\n';
      for (let i = 0; i < fileData.extras.length; i++) {
        htmlContent += '    <div><input class="checkbox hidden extra" type="checkbox"> ' + fileData.extras[i] + '</div>\n';
      }
    }

    if (fileData.docLinks.length !== 0) {
      htmlContent += '  <h3>Links to documentation</h3>\n  <ul>\n';
      for (const docLink of fileData.docLinks) {
        htmlContent += '    <li><a href="' + docLink.href + '">' + docLink.html + '</a></li>\n';
      }
      htmlContent += '  </ul>\n';
    }
    htmlContent += '</section>\n\n';
    htmlExamples.push(htmlContent);
  }
  return htmlExamples;
}
