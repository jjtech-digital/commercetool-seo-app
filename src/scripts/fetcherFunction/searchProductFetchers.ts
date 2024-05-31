import axios from 'axios';
import { apiBaseUrl } from '../../constants';

export const getSearchProduct = async (
  searchText: string,
  limit: number,
  offset: number,
  dataLocale: string |null,
  setState: Function
) => {
  try {
    setState((prev: any) => ({ ...prev, pageLoading: true }));
    const response = await axios.get(`${apiBaseUrl}/products/search`, {
      params: {
        query: searchText,
        limit: limit,
        offset: offset,
        locale: dataLocale,
      },
    });
    setState((prev: any) => ({ ...prev, pageLoading: false }));
    return response.data.data; 
  } catch (error) {
    setState((prev: any) => ({ ...prev, pageLoading: false }));
    console.error('Error fetching search products:', error);
    throw new Error('Failed to fetch search products');
  }
};
