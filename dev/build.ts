import * as fm from './file-management.js';
import { createImgFromSource } from './create-img-from-source.js';

main().catch(console.error);

/*
  creates images (.png) file from the codes provided
*/
async function main() {
  const results = [];
  const style = (await fm.readStyleFile()).toString();
  const stages = await fm.listStageFolders();

  for (const stage of stages) {
    const stageFiles = await fm.listStageExampleFiles(stage);
    for (const sourceFile of stageFiles) {
      // do we need to create an image ?
      if (await fm.isNewImageNeeded(stage, sourceFile)) {
        const fileContent = (await fm.readStageSourceFile(stage, sourceFile)).toString();

        const screenshot = await createImgFromSource(sourceFile, fileContent, style);

        results.push(fm.saveImage(screenshot, stage, sourceFile));
      }
    }
  }

  // report rejected error
  const outcomes = await Promise.allSettled(results);
  for (const outcome of outcomes) {
    if (outcome.status === 'rejected') {
      console.error(outcome.reason);
    }
  }
}
