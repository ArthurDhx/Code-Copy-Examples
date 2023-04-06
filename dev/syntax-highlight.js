import fs from 'fs';
import hljs from 'highlight.js/lib/core.js';
import javascript from 'highlight.js/lib/languages/javascript.js';
import xml from 'highlight.js/lib/languages/xml.js';

hljs.registerLanguage('js', javascript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('html', xml);

const fileName = process.argv[2];
const file = fs.readFileSync(fileName, 'utf-8');

const fileNameExt = fileName.substring(fileName.lastIndexOf('.') + 1);

const highlightedCode = hljs.highlight(fileNameExt, file).value;

console.log(`
<!doctype html>
<title>${fileName}</title>
<link rel="stylesheet" href="../node_modules/highlight.js/styles/github.css">
<style>
  pre {
    border: 1px solid black;
    width: 827px;
    padding: 1em;
    box-sizing: border-box;
    line-height: 150%;

    font-family: Consolas,monospace;
    font-size: 13px;
  }
</style>

<pre>${highlightedCode}</pre>
`);
