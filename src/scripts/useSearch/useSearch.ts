

import { getSearchProduct } from "../fetcherFunction/searchProductFetchers";

export function useSearch() {
  const fetchSearchResults = async (searchText: string, limit: number, offset: number, dataLocale: string| null,setState: Function) => {
    return await getSearchProduct(searchText, limit, offset, dataLocale,setState);
  };

  return fetchSearchResults;
}
