import axios from 'axios';
import { apiBaseUrl } from '../../constants';

export const createCtObjToken = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/rule`);
    return response;
  } catch (error) {
    console.error('Error generating SEO metadata:', error);
    return null;
  }
};
