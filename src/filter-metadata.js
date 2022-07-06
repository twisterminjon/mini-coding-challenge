/*
type Metadata = {
  url: string | null;
  siteName: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  author: string | null;
};
*/

/**
 * Filters the given Metadata array to only include the objects that match the given search query.
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter with the special characters removed.
 * Can return an empty array if no Metadata objects match the search query.
 * @param {Metadata[]} metadata - An array of Metadata objects
 * @param {string} query - The search query string
 * @returns {Metadata[]} - An array of Metadata objects that match the given search query
 */
export default function filterMetadata(metadata, query) {
  // if there is no metadata or it's incorrect return []
  if (!metadata || !Array.isArray(metadata)) return [];

  // if query is empty return metadata
  if (!query) return metadata;

  // filter special characters from query and split it to individual words
  const queries = query.toLowerCase().replace(/[.,-]/g, '').split(' ');

  // initial results array
  let result = [];

  // for every query (every word in query string)
  for (const query of queries) {
    let filtered = metadata.filter(obj => {
      // form an array of metadata values
      const values = Object.values(obj)
        .map(val => (Array.isArray(val) ? val.join(' ') : val)) // join keywords array to a string
        .filter(val => val != null); // exclude null values (to avoid .toLowerCase() is not a function error)

      for (const value of values) {
        const valueWithoutSpecialChars = value.toLowerCase().replace(/[.,-]/g, '');

        // check if value includes query or vice versa
        if (valueWithoutSpecialChars.includes(query) || query.includes(valueWithoutSpecialChars)) return true;
      }
    });

    // push filtered objects to result array
    result.push(...filtered);
  }

  // remove duplicates if any
  result = [...new Set(result)];

  return result;
}
