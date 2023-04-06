import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';

const md = new MarkdownIt();

export interface FileDescription {
  title: string,
  preHTML?: string,
  imageAlt: string, // defaults from the title
  postHTML?: string,
  extras: string[],
  docLinks: DocumentationLink[],
  metadata: Metadata,
}

export interface StageDescription {
  title: string,
  description?: string,
  docLinks: DocumentationLink[],
}

interface DocumentationLink {
  href: string,
  html: string,
}

interface Metadata {
  badges: string[],
  extraHeading?: string,
  category?: string,
  difficulty?: string,
}

export function parseExampleMetadataFile(fileContent: string): FileDescription {
  const tokens = md.parse(fileContent, {});
  return parseExampleDescription(tokens);
}

export function parseStageMetadataFile(fileContent: string): StageDescription {
  const tokens = md.parse(fileContent, {});
  return parseStageDescription(tokens);
}

function parseExampleDescription(tokens: Token[]): FileDescription {
  const tokenSections = splitTokens(tokens, isH2);

  const contentSection = tokenSections.shift();
  if (!contentSection) {
    throw new Error('the description file must not be empty');
  }

  const { title, preHTML, alt, postHTML } = parseContentSection(contentSection);

  let docLinks: DocumentationLink[] = [];
  let metadata: Metadata = {
    badges: [],
  };
  let extras: string[] = [];

  for (const slicedTokens of tokenSections) {
    const sectionName = extractRenderedHeadingContent(slicedTokens);
    switch (sectionName.toLowerCase()) {
      case 'documentation links':
        docLinks = parseDocLinks(slicedTokens);
        break;
      case 'metadata':
        metadata = parseMetadata(slicedTokens);
        break;
      case 'extra challenges':
        extras = parseExtras(slicedTokens);
        break;
      default:
        throw new Error(`unknown section: ${sectionName}`);
    }
  }

  const description: FileDescription = {
    title,
    imageAlt: alt || title,
    docLinks,
    extras,
    metadata,
  };

  // preHTML and postHTML may be empty
  if (preHTML) {
    description.preHTML = preHTML;
  }
  if (postHTML) {
    description.postHTML = postHTML;
  }

  return description;
}

function parseStageDescription(tokens: Token[]): StageDescription {
  const tokenSections = splitTokens(tokens, isH2);

  const contentSection = tokenSections.shift();
  if (!contentSection) {
    throw new Error('the description file must not be empty');
  }

  const title = extractMainTitle(contentSection);
  const description = renderTokens(contentSection);

  let docLinks: DocumentationLink[] = [];

  for (const slicedTokens of tokenSections) {
    const sectionName = extractRenderedHeadingContent(slicedTokens);
    switch (sectionName.toLowerCase()) {
      case 'documentation links':
        docLinks = parseDocLinks(slicedTokens);
        break;
      default:
        throw new Error(`unknown section: ${sectionName}`);
    }
  }

  const stageDescription: StageDescription = {
    title,
    docLinks,
  };
  if (description) {
    stageDescription.description = description;
  }

  return stageDescription;
}

function splitTokens(tokens: Token[], trigger: (token: Token)=> boolean) {
  if (tokens.length === 0) return [];

  const tokenSections = [];

  let headingIndex = 0;
  for (let i = 1; i < tokens.length; i++) {
    if (trigger(tokens[i])) {
      tokenSections.push(tokens.slice(headingIndex, i));
      headingIndex = i;
    }
  }
  // add the last run of tokens
  tokenSections.push(tokens.slice(headingIndex, tokens.length));

  return tokenSections;
}

function isLI(token: Token): boolean {
  return token.type === 'list_item_open';
}

function isH2(token: Token): boolean {
  return token.type === 'heading_open' && token.tag === 'h2';
}

// checks if there is a heading, if not, return undefined
// if there is a heading, splices it out and returns the rendered inline token
function extractRenderedHeadingContent(tokens: Token[]): string {
  const headingIndex = findIndexByType(tokens, 'heading_open');

  const title = renderInlineToken(tokens[headingIndex + 1]);

  if (!title) {
    throw new Error('a description file must not have an empty title');
  }

  tokens.splice(0, 3);
  return title;
}

function parseContentSection(tokens: Token[]) {
  const title = extractMainTitle(tokens);

  // we expect the first <img in the content to give us the 'alt' attribute for the code image
  const altIndex = findSeparatorImgIndex(tokens);
  if (altIndex === -1) {
    const preHTML = renderTokens(tokens);
    return { title, preHTML };
  } else {
    // there is a <p> and </p> around the image and it needs to be ignored
    const preHTML = renderTokens(tokens, 0, altIndex - 1);
    const postHTML = renderTokens(tokens, altIndex + 2);
    const alt = parseImgAlt(tokens[altIndex]);
    return { title, preHTML, alt, postHTML };
  }
}

// get the content of the title, removes the tokens
function extractMainTitle(tokens: Token[]) {
  if (tokens[0].type !== 'heading_open' || tokens[0].tag !== 'h1') {
    throw new Error('a description file must start with a main title');
  }
  return extractRenderedHeadingContent(tokens);
}

function findSeparatorImgIndex(tokens: Token[]) {
  return tokens.findIndex((token, index) => {
    return (token.type === 'inline' && token.content.startsWith('<img')) &&
      tokens[index - 1]?.type === 'paragraph_open' &&
      tokens[index + 1]?.type === 'paragraph_close';
  });
}

function parseImgAlt(token: Token): string | undefined {
  const imageContent = token.content;

  const altMatch = new RegExp(/\balt="([^"]*)"/).exec(imageContent);
  return altMatch ? altMatch[1] : undefined;
}

function renderTokens(tokens: Token[], firstIndex = 0, lastIndex = tokens.length) {
  const slicedTokens = tokens.slice(firstIndex, lastIndex);
  const renderedTokens = md.renderer.render(slicedTokens, md.options, {}).trim();
  return renderedTokens || undefined;
}

function renderInlineToken(token: Token) {
  if (!token.children) return undefined;
  const rendered = md.renderer.render(token.children, md.options, {}).trim();
  return rendered || undefined;
}

function parseDocLinks(tokens: Token[]): DocumentationLink[] {
  const docLinks: DocumentationLink[] = [];

  const bulletOpenIndex = findIndexByType(tokens, 'bullet_list_open');
  const bulletCloseIndex = findIndexByType(tokens, 'bullet_list_close');

  if (bulletOpenIndex === -1 || bulletCloseIndex === -1) {
    return docLinks;
  }

  const ulTokens = tokens.slice(bulletOpenIndex + 1, bulletCloseIndex);

  // get all the Tokens inside the different <li>
  const liSections = splitTokens(ulTokens, isLI);

  for (const item of liSections) {
    const inlineToken = findTokenByType(item, 'inline');

    if (inlineToken && inlineToken.children) {
      const inlineChildren = inlineToken.children;

      const aToken = inlineChildren[0];
      if (aToken.type !== 'link_open') {
        throw new Error(`A documentation link must be a markdown link: ${inlineToken.content}`);
      }

      // check the first link_close is at the end (no other links present)
      if (findIndexByType(inlineChildren, 'link_close') !== inlineChildren.length - 1) {
        throw new Error(`A documentation link must be a single markdown link: ${inlineToken.content}`);
      }

      const html = renderTokens(inlineChildren.slice(1, -1));
      if (!html) {
        throw new Error(`Link text must not be empty: ${inlineToken.content}`);
      }

      const href = aToken?.attrGet('href');
      if (!href) {
        throw new Error(`The link must have an href: ${inlineToken.content}`);
      }
      docLinks.push({ href, html });
    } else {
      throw new Error('There must not be empty links in documentation links');
    }
  }
  return docLinks;
}

function parseMetadata(tokens: Token[]): Metadata {
  const data: Metadata = {
    badges: [],
  };

  const bulletOpenIndex = findIndexByType(tokens, 'bullet_list_open');
  const bulletCloseIndex = findIndexByType(tokens, 'bullet_list_close');

  if (bulletOpenIndex === -1 || bulletCloseIndex === -1) {
    return data;
  }

  const ulTokens = tokens.slice(bulletOpenIndex + 1, bulletCloseIndex);

  // get all the Tokens inside the different <li>
  const liSections = splitTokens(ulTokens, isLI);

  for (const liSection of liSections) {
    const inlineToken = findTokenByType(liSection, 'inline');

    if (inlineToken && inlineToken.content) {
      if (inlineToken.children && inlineToken.children.length > 1) {
        throw new Error(`metadata must not have markup: ${inlineToken.content}`);
      }

      const colonNumber = (inlineToken.content.match(/:/g) || []).length;

      if (colonNumber === 0) {
        throw new Error(`There must be a colon in a metadata line: ${inlineToken.content}`);
      } else if (colonNumber > 1) {
        throw new Error(`There must be only one colon in a metadata line: ${inlineToken.content}`);
      }

      // the metadata line is of the form "label: value"
      const [label, value] = inlineToken.content.split(/\s*:\s*/);

      if (value) {
        switch (label) {
          case 'badge':
            data.badges.push(value);
            break;

          case 'category':
            data.category = value;
            break;

          case 'difficulty':
            data.difficulty = value;
            break;

          case 'extra-heading':
            data.extraHeading = value;
            break;

          default:
            throw new Error(`unknown metadata ${label}: ${value}`);
        }
      }
    }
  }

  return data;
}

function parseExtras(tokens: Token[]): string[] {
  const bulletOpenIndex = findIndexByType(tokens, 'bullet_list_open');
  const bulletCloseIndex = findIndexByType(tokens, 'bullet_list_close');

  const ulTokens = tokens.slice(bulletOpenIndex + 1, bulletCloseIndex);

  // get all the Tokens inside the different <li>
  const liSections = splitTokens(ulTokens, isLI);

  const extras = [];
  for (const liSection of liSections) {
    const inlineToken = findTokenByType(liSection, 'inline');

    if (inlineToken && inlineToken.children) {
      const inlineChildren = inlineToken.children;
      const html = renderTokens(inlineChildren);

      if (html) {
        const lines = html.split('\n');
        for (const line of lines) {
          if (line.startsWith('[ ] ')) {
            // get string after '[ ] ' – description of the extra challenge
            extras.push(line.substring(4));
          } else {
            throw new Error(`An extra challenge should start with "[ ]": '${line}'`);
          }
        }
      }
    }
  }
  return extras;
}

function findIndexByType(tokens: Token[], type: string) {
  return tokens.findIndex(token => (token.type === type));
}

function findTokenByType(tokens: Token[], type: string) {
  const index = findIndexByType(tokens, type);

  return (index !== -1) ? tokens[index] : null;
}
