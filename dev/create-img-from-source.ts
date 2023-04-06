import puppeteer from 'puppeteer';
import hljs from 'highlight.js';
// eslint-disable-next-line import/extensions
import javascript from 'highlight.js/lib/languages/javascript.js';
// eslint-disable-next-line import/extensions
import xml from 'highlight.js/lib/languages/xml.js';

hljs.registerLanguage('js', javascript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('html', xml);

export async function createImgFromSource(sourceFile: string, fileContent: string, style: string): Promise<Buffer> {
  const html = createHtmlString(sourceFile, fileContent, style);
  return takeScreenshot(html);
}


/*
    use sourceFile, fileContent, style
    make html
  */
function createHtmlString(sourceFile: string, fileContent: string, style: string) {
  const fileNameExt = sourceFile.substring(sourceFile.lastIndexOf('.') + 1);
  const highlightedCode = hljs.highlight(fileContent, { language: fileNameExt }).value;

  return `<!doctype html>
    <style>
    pre {
    width: 825px;
    padding: 1em;
    box-sizing: border-box;
    line-height: 150%;
    font-family: Consolas,monospace;
    font-size: 13px;
    }
    ${style}
    </style>
    <pre>${highlightedCode}</pre>`;
}

/*
    use html
    returns the screenshot of the html content
  */
async function takeScreenshot(html: string): Promise<Buffer> {
  // launch a new chrome instance
  const browser = await puppeteer.launch({
    headless: true,
  });

  // create a new page
  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
  });

  // set html as the page content
  await page.setContent(html, {
    waitUntil: 'domcontentloaded',
  });

  // take everything inside the element '<pre>'
  const rect = await page.evaluate(selector => {
    const element = <HTMLElement>document.querySelector(selector);

    if (!element) {
      return null;
    }
    const { x, y, width, height } = element.getBoundingClientRect();

    return { left: x, top: y, width, height, id: element.id };
    // eslint-disable-next-line no-undef
  }, 'pre');

  if (rect) {
    const screenshot = await page.screenshot({
      type: 'png',
      clip: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      },
    });
    await browser.close();

    if (Buffer.isBuffer(screenshot)) {
      return screenshot;
    }
    throw new Error('Screenshot is not a Buffer');
  }
  await browser.close();
  throw new Error('Selector pre doesn\'t exist');
}
