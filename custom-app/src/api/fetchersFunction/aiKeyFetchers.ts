import axios from 'axios';
import {
  CTP_CUSTOM_OBJ_AI_CONTAINER_KEY,
  CTP_CUSTOM_OBJ_AI_CONTAINER_NAME,
  LS_KEY,
} from '../../constants';

export const saveAiKeyInCtCustomObj = async (
  aiKey: string,
  setState: Function,
  secrets: any
) => {
  const { CTP_API_URL, CTP_PROJECT_KEY } = secrets;
  const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);
  try {
    setState((prev: any) => ({ ...prev, isApiFetching: true }));
    const baseUrl = `${CTP_API_URL}/${CTP_PROJECT_KEY}/custom-objects`;
    const requestBody = {
      container: CTP_CUSTOM_OBJ_AI_CONTAINER_NAME,
      key: CTP_CUSTOM_OBJ_AI_CONTAINER_KEY,
      value: aiKey,
    };

    const response = await axios.post(baseUrl, JSON.stringify(requestBody), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    setState((prev: any) => ({ ...prev, isApiFetching: false }));
    return response.data;
  } catch (error) {
    setState((prev: any) => ({ ...prev, isApiFetching: false }));
    console.error('Error saving key:', error);
    return error;
  }
};

export const getSavedAiKeyFromCtCustomObj = async (
  setState: Function,
  secrets: any
) => {
  const { CTP_API_URL, CTP_PROJECT_KEY } = secrets;
  const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);
  try {
    setState((prev: any) => ({ ...prev, pageLoading: true }));
    const baseUrl = `${CTP_API_URL}/${CTP_PROJECT_KEY}/custom-objects/${CTP_CUSTOM_OBJ_AI_CONTAINER_NAME}/${CTP_CUSTOM_OBJ_AI_CONTAINER_KEY}`;

    const response = await axios.get(baseUrl, {
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
