import { promises as fs } from 'fs';

const STYLE_FILE_PATH = './node_modules/highlight.js/styles/github.css';
const IMAGES_DIR_PATH = './docs/img/';
const CODE_EXAMPLES_DIR_PATH = './code-examples/';
const PAGES_DIR_PATH = './docs/pages/';
const MD_SUFFIX = '.md';

/*
  returns a string array containing all the stage-* folders
*/
export async function listStageFolders(): Promise<string[]> {
  // array of string containing all the folder at ./code-examples/
  const allFolders = await fs.readdir(CODE_EXAMPLES_DIR_PATH, { withFileTypes: true });
  const stageFolders = [];

  for (const folder of allFolders) {
    if (folder.isDirectory()) stageFolders.push(folder.name);
  }

  return stageFolders;
}

/*
  if image doesn't exist OR if SourceFile was edited sooner than img => must create
  return true if must create
  else false
*/
export async function isNewImageNeeded(stage: string, sourceFile: string): Promise<boolean> {
  if (!await verifyImgExist(stage, sourceFile) || await dateComparison(stage, sourceFile)) {
    return true;
  }
  return false;
}

/*
  returns true if the img of SourceFile exists
  inside './docs/img
*/
async function verifyImgExist(stage: string, sourceFile: string): Promise<boolean> {
  const missingImages = await fs.readdir(IMAGES_DIR_PATH);

  return missingImages.includes(stage + '-' + sourceFile + '.png');
}

// returns true if sourceFile was edited sooner than img
async function dateComparison(stage: string, sourceFile: string): Promise<boolean> {
  const imgStats = await fs.stat(IMAGES_DIR_PATH + stage + '-' + sourceFile + '.png');
  const sourceStats = await fs.stat(CODE_EXAMPLES_DIR_PATH + stage + '/' + sourceFile);

  return sourceStats.mtime > imgStats.mtime;
}

/*
  take a screenshot
  verify if screenshot is a Buffer
  create .png of the Buffer
*/
export async function saveImage(screenshot: Buffer, stage: string, sourceFile: string): Promise<void> {
  await fs.writeFile(IMAGES_DIR_PATH + stage + '-' + sourceFile + '.png', screenshot);
}

export async function listStageFiles(stage: string): Promise<string[]> {
  return fs.readdir(CODE_EXAMPLES_DIR_PATH + stage);
}

export async function listStageMetadataFiles(stage: string): Promise<string[]> {
  const stageFiles = await listStageFiles(stage);
  return stageFiles.filter(f => f.endsWith(MD_SUFFIX));
}

export async function listStageExampleFiles(stage: string): Promise<string[]> {
  const stageFiles = await listStageFiles(stage);
  return stageFiles.filter(f => !f.endsWith(MD_SUFFIX));
}


export async function readStageSourceFile(stage: string, sourceFile: string): Promise<Buffer> {
  return fs.readFile(CODE_EXAMPLES_DIR_PATH + stage + '/' + sourceFile);
}

export async function readStyleFile(): Promise<Buffer> {
  return fs.readFile(STYLE_FILE_PATH);
}

export async function saveStagePage(stage: string, fileContent: string): Promise<void> {
  return fs.writeFile(PAGES_DIR_PATH + stage + '.html', fileContent);
}
