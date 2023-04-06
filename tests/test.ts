import * as fs from 'fs';
import * as path from 'path';
import * as parser from '../dev/description-parser.js';

const FILES_DIR = './tests/examples';
const STAGES_DIR = './tests/stages';

const JSON_SUFFIX = '.json';
const MD_SUFFIX = '.md';

interface ErrorDescription {
  error: string,
}

function isErrorDescription<T>(x: T | ErrorDescription): x is ErrorDescription {
  return 'error' in x;
}

function setupTests<T>(dir: string, parserFunction: (str: string)=> T): void {
  const files = fs.readdirSync(dir);

  // test JSON files contain the expected output of parsing
  // either a normal valid description, or an expected error message
  type ExpectedDescription = T | ErrorDescription;


  for (const file of files) {
    // set up a QUnit test for each MD file
    if (file.endsWith(MD_SUFFIX)) {
      QUnit.test(file, (assert) => {
        const expectedJSON = fs.readFileSync(path.join(dir, file + JSON_SUFFIX), 'utf8');
        const expectedOutput = JSON.parse(expectedJSON) as ExpectedDescription;

        const fileContent = fs.readFileSync(path.join(dir, file), 'utf-8');

        if (isErrorDescription(expectedOutput)) {
          assert.throws(
            () => parserFunction(fileContent),
            new Error(expectedOutput.error),
          );
        } else {
          const metadata = parserFunction(fileContent);

          assert.deepEqual(
            metadata,
            expectedOutput,
          );
        }
      });
    }
  }
}

setupTests(FILES_DIR, parser.parseExampleMetadataFile);
setupTests(STAGES_DIR, parser.parseStageMetadataFile);
