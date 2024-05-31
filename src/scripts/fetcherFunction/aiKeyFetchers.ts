import axios from 'axios';
import { apiBaseUrl } from '../../constants';

export const saveAiKey = async (aiKey: string, setState: Function) => {
  const accessToken = localStorage.getItem('token');
  try {
    setState((prev: any) => ({ ...prev, isApiFetching: true }));
    const response = await axios.post(`${apiBaseUrl}/ai-key`, {
      aiKey: aiKey,
      accessToken: accessToken,
    });
    setState((prev: any) => ({ ...prev, isApiFetching: false }));
    return response.data;
  } catch (error) {
    setState((prev: any) => ({ ...prev, isApiFetching: false }));
    console.error('Error saving key:', error);
    return error;
  }
};

export const getSavedAiKey = async (setState: Function) => {
  const accessToken = localStorage.getItem('token');
  try {
    setState((prev: any) => ({ ...prev, pageLoading: true }));
    const response = await axios.get(`${apiBaseUrl}/ai-key`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setState((prev: any) => ({ ...prev, pageLoading: false }));
    return response.data;
  } catch (error) {
    setState((prev: any) => ({ ...prev, pageLoading: false }));
    console.error('Error fetching saved key:', error);
    return error;
  }
};
