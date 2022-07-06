// Note: Please do not use JSDOM or any other external library/package (sorry)
/*
type Metadata = {
  url: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
};
*/

/**
 * Gets the URL, site name, title, description, keywords, and author info out of the <head> meta tags from a given html string.
 * 1. Get the URL from the <meta property="og:url"> tag.
 * 2. Get the site name from the <meta property="og:site_name"> tag.
 * 3. Get the title from the the <title> tag.
 * 4. Get the description from the <meta property="og:description"> tag or the <meta name="description"> tag.
 * 5. Get the keywords from the <meta name="keywords"> tag and split them into an array.
 * 6. Get the author from the <meta name="author"> tag.
 * If any of the above tags are missing or if the values are empty, then the corresponding value will be null.
 * @param html The complete HTML document text to parse
 * @returns A Metadata object with data from the HTML <head>
 */
export default function getMetadata(html) {
  // initial metadata object
  const metadata = {
    url: null,
    siteName: null,
    title: null,
    description: null,
    keywords: null,
    author: null,
  };

  // if no param or param is not string do nothing
  if (!html || typeof html !== 'string') return metadata;

  // get rid of whitespace (\n)
  const htmlNoWhitespace = html.replace(/\n/g, '');

  // get the page title
  metadata.title = htmlNoWhitespace?.match(/<title(>(.*?)<)/i)?.[2];

  // match string to extract <meta> tags
  const metatagsArray = htmlNoWhitespace.match(/<meta .*?>/g); // ['<meta name="...">', '<meta name="...">']

  // if there's no metatags return empty data with title
  if (!metatagsArray) return metadata;

  // search for name and property attributes
  // assign their contents to metadata object fields
  for (const str of metatagsArray) {
    const name = str
      .match(/name=("(.*?)")/)?.[0]
      .split('name=')[1]
      .replace(/"/g, '');

    const property = str
      .match(/property=("(.*?)")/)?.[0]
      .split('property=')[1]
      .replace(/"/g, '');

    const content = str
      .match(/content=("(.*?)")/)?.[0]
      .split('content=')[1]
      .replace(/"/g, '');

    if (property === 'og:url') metadata.url = content;
    if (property === 'og:site_name') metadata.siteName = content;
    if (property === 'og:description') metadata.description = content;
    if (name === 'description') metadata.description = content.trim();
    if (name === 'keywords') metadata.keywords = content.trim() ? content.split(',') : [];
    if (name === 'author') metadata.author = content;
  }

  // workaround (one test wants title as "", another as null)
  if (metadata.title === undefined) metadata.title = null;

  return metadata;
}
