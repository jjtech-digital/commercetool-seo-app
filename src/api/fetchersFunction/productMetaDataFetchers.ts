import axios from 'axios';
import {
  CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_KEY,
  CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_NAME,
  CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_KEY, 
  CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_NAME,
  LS_KEY,
} from '../../constants';
import OpenAI from 'openai';
import { getAllSavedRulesFromCtObj } from './ruleFetchers';
import { getProductById } from './utils';
import { getCode } from '../../retrieveSecrets';

export const updateProductMeta = async (
  productId: string,
  keyFeatures: string,
  description: string,
  version: number,
  dataLocale: any,
  setState?: Function
) => {
  const CTP_API_URL = getCode("CTP_API_URL")
  const CTP_PROJECT_KEY = getCode("CTP_PROJECT_KEY")
  const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);

  const productResponse = await getProductById(productId);

  const existingDescriptions =
    productResponse?.masterData?.current?.descriptionAllLocales || [];

  const descriptionObj: any = {};
  for (const item of existingDescriptions) {
    if (item.locale !== dataLocale) {
      descriptionObj[item.locale] = item.value;
    }
  }
  descriptionObj[dataLocale] = description;
  
  let keyFeaturesObj: any = {};
  let existingFeatures =
    productResponse?.masterData?.current?.masterVariant.attributesRaw.find(
      (item: any) => item.name === 'features'
    );
    if (existingFeatures?.value?.[0]) {
        existingFeatures.value[0][dataLocale] = keyFeatures || " ";
    }
    if(!existingFeatures){
      existingFeatures = { name : "features", value : [{ [dataLocale] : ""}]}
      const features = {name : "features", value : [{ [dataLocale] : ""}]}
      productResponse?.masterData?.current?.masterVariant.attributesRaw.push(features);
      existingFeatures.value[0][dataLocale] = keyFeatures || " ";
    }

  keyFeaturesObj = existingFeatures.value[0]
  const apiUrl = `${CTP_API_URL}/${CTP_PROJECT_KEY}/products/${productId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const x = [keyFeaturesObj];

  const payload = {
    version: version,
    actions: [
      {
        action: 'setDescription',
        description: descriptionObj,
        staged: false,
      },
      {
        action: 'setAttributeInAllVariants',
        name: 'features',
        value: x,
        staged: false,
      },
    ],
  };
  try {
    const response = await axios.post(apiUrl, payload, { headers });

      setState?.((prev: any) => ({
        ...prev,
        notificationMessage:
          keyFeatures ? 'Description and key features updated successfully.' : 'Description updated successfully.',
        notificationMessageType: 'success',
      }));
    return response.data;
  } catch (error) {
      setState?.((prev: any) => ({
        ...prev,
        notificationMessage: 'Error updating product description and key features.',
        notificationMessageType: 'error',
      }));
    console.error(
      'Error updating product description and key features:',
      error
    );
    return null;
  }
};

export const queryProductOpenAi = async (
  query: string,
  accessToken?: string | null,
  openAiKey?: string
) => {
  const openAi = new OpenAI({
    apiKey: openAiKey,
    dangerouslyAllowBrowser: true,
  });
  let updatedPromptDescription = '';
  let updatedPromptKeyfeatures = '';
  if (accessToken) {
    const promptDescription: any = await getAllSavedRulesFromCtObj(
      accessToken,
      CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_NAME,
      CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_KEY
    );
    const promptKeyFeatures: any = await getAllSavedRulesFromCtObj(
      accessToken,
      CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_NAME,
      CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_KEY
    );
    const allEmptyDescriptionrules = promptDescription?.value?.every((p: string) => /^\s*$/.test(p));
    const allEmptyKeyFeaturesrules = promptKeyFeatures?.value?.every((p: string) => /^\s*$/.test(p));

    if (!allEmptyDescriptionrules && !allEmptyKeyFeaturesrules) {
      updatedPromptDescription = promptDescription?.value?.join(' ');
      updatedPromptKeyfeatures = promptKeyFeatures?.value?.join(' ');
    }
  }

  let contentString = `Find some key features and a precise description for a product with ${query}. The format for the output should be like this - *Description*:abc and *Key Features*:abc"`;

  // Append rules to the content string if updatedPrompt is not empty
  if (updatedPromptDescription && updatedPromptKeyfeatures) {
    contentString += ` and Rules for description: ${updatedPromptDescription} and rules for key features: ${updatedPromptKeyfeatures}`;
  } else {
    // Add fallback rules
    contentString += ` and Rules: Include the main keyword in both the title and description. Seperate all the key features ith comma. Give a user engaging description which would be able to put forward the proper explaination about the product and spark curiosity in incoming traffic. Limit the description to under 150-160 characters for full visibility in search results. Give atleast 5 key features, you can give more`;
  }
  try {
    const response = await openAi.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      temperature: 0.5,
      max_tokens: 3500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      messages: [
        {
          role: 'user',
          content: contentString,
        },
      ],
    });
    return response;
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    return null;
  }
};
