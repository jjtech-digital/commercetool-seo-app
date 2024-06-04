import axios from 'axios';
import {
  CTP_API_URL,
  CTP_CUSTOM_OBJ_CONTAINER_KEY,
  CTP_CUSTOM_OBJ_CONTAINER_NAME,
  CTP_PROJECT_KEY,
  LS_KEY,
} from '../../constants';

export const createRulesInCtCustomObj = async (
  payload: any,
  setState: Function
) => {
  const prompts = payload.rulesContent.map(
    (rule: { rulesInput: any }) => rule.rulesInput
  );
  const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);
  try {
    setState((prev: any) => ({ ...prev, isApiFetching: true }));
    const baseUrl = `${CTP_API_URL}/${CTP_PROJECT_KEY}/custom-objects`;

    const requestBody = {
      container: `${CTP_CUSTOM_OBJ_CONTAINER_NAME}`,
      key: `${CTP_CUSTOM_OBJ_CONTAINER_KEY}`,
      value: prompts,
    };

    const response = await axios.post(baseUrl, JSON.stringify(requestBody), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    setState((prev: any) => ({ ...prev, isApiFetching: false }));
    return response?.data;
  } catch (error) {
    setState((prev: any) => ({ ...prev, isApiFetching: false }));
    console.error('Error creating rule', error);
    return error;
  }
};
export const getAllSavedRulesFromCtObj = async (
  accessToken: string,
  setState?: Function
) => {
  try {
    setState && setState((prev: any) => ({ ...prev, pageLoading: true }));
    const baseUrl = `${CTP_API_URL}/${CTP_PROJECT_KEY}/custom-objects/${CTP_CUSTOM_OBJ_CONTAINER_NAME}/${CTP_CUSTOM_OBJ_CONTAINER_KEY}`;
    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setState &&setState((prev: any) => ({ ...prev, pageLoading: false }));
    return response?.data;
  } catch (error) {
    setState && setState((prev: any) => ({ ...prev, pageLoading: false }));
    console.error('Error fetching all rules:', error);
    return error;
  }
};
