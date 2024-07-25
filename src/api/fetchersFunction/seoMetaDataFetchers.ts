import axios from 'axios';
import { CTP_API_URL, CTP_CUSTOM_OBJ_SEO_CONTAINER_KEY, CTP_CUSTOM_OBJ_SEO_CONTAINER_NAME, CTP_PROJECT_KEY, LS_KEY } from '../../constants';
import { getProductDetails } from '../graphql/productDetails';
import apiRoot from '../apiRoot';
import OpenAI from 'openai';
import { getAllSavedRulesFromCtObj } from './ruleFetchers';

export const getProductById = async (productId: string, locale?: string) => {
  try {
    const response = await apiRoot
      .graphql()
      .post({
        body: {
          query: getProductDetails(),
          variables: {
            id: productId,
            Locale: locale,
          },
        },
      })
      .execute();

    const product = response.body.data.product;

    if (!product) {
      return `Product with ID ${productId} not found.`;
    }
    return product;
  } catch (error) {
    console.error(`Error retrieving product by ID ${productId}:`, error);

    return 'Failed to retrieve product details';
  }
};
export const generateSeoMetaData = async (
  productId: string,
  dataLocale: any,
  setState?: Function
) => {
  const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);
  const openAiKey = localStorage.getItem(LS_KEY.OPEN_AI_KEY);
  if (!openAiKey) {
      setState?.((prev: any) => ({
        ...prev,
        notificationMessage:
          'OpenAI key is missing. Please set it in the settings.',
        notificationMessageType: 'error',
      }));
    return null;
  }
  try {
    const productResponse = await getProductById(productId, dataLocale);

    const productName = productResponse?.masterData?.current?.name;
    const categories = productResponse?.masterData?.current?.categories;

    const categoryNames = categories
      ?.map((category: any) => category?.name)
      ?.join(', ');
    const query = `Product name: "${productName}", Categories: "${categoryNames}"`;

    const localeQuery = dataLocale ? `, Locale: "${dataLocale}"` : '';
    const data: any = await queryOpenAi(
      query + localeQuery,
      accessToken,
      openAiKey
    );
    if (data?.status && data?.status == 401) {
        setState?.((prev: any) => ({
          ...prev,
          notificationMessage: data?.error?.message,
          notificationMessageType: 'error',
        }));
      return;
    }

    return { ...data, productId: productId };
  } catch (error) {
    console.error('Error generating SEO metadata:', error);

      setState?.((prev: any) => ({
        ...prev,
        notificationMessage: 'Error generating SEO metadata.',
        notificationMessageType: 'error',
      }));
    return null;
  }
};

export const updateProductSeoMeta = async (
  productId: string,
  metaTitle: string,
  metaDescription: string,
  version: number,
  dataLocale: any,
  setState?: Function
) => {
  const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);

  const productResponse = await getProductById(productId);

  const existingMetaTitles =
    productResponse?.masterData?.current?.metaTitleAllLocales || [];
  const existingMetaDescriptions =
    productResponse?.masterData?.current?.metaDescriptionAllLocales || [];

  const metaTitleObj: any = {};
  for (const item of existingMetaTitles) {
    if (item.locale !== dataLocale) {
      metaTitleObj[item.locale] = item.value;
    }
  }
  // Add the new metaTitle for dataLocale
  metaTitleObj[dataLocale] = metaTitle;

  const metaDescriptionObj: any = {};
  for (const item of existingMetaDescriptions) {
    if (item.locale !== dataLocale) {
      metaDescriptionObj[item.locale] = item.value;
    }
  }
  // Add the new metaDescription for dataLocale
  metaDescriptionObj[dataLocale] = metaDescription;

  const apiUrl = `${CTP_API_URL}/${CTP_PROJECT_KEY}/products/${productId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const payload = {
    version: version,
    actions: [
      {
        action: 'setMetaTitle',
        metaTitle: metaTitleObj,
        staged: false,
      },
      {
        action: 'setMetaDescription',
        metaDescription: metaDescriptionObj,
        staged: false,
      },
    ],
  };
  try {
    const response = await axios.post(apiUrl, payload, { headers });

      setState?.((prev: any) => ({
        ...prev,
        notificationMessage: 'SEO title and description updated successfully.',
        notificationMessageType: 'success',
      }));
    return response.data;
  } catch (error) {
      setState?.((prev: any) => ({
        ...prev,
        notificationMessage: 'Error updating SEO title and description.',
        notificationMessageType: 'error',
      }));
    console.error('Error updating product SEO meta:', error);
    return null;
  }
};

export const queryOpenAi = async (
  query: string,
  accessToken?: string | null,
  openAiKey?: string
) => {
  const openAi = new OpenAI({
    apiKey: openAiKey,
    dangerouslyAllowBrowser: true,
  });
  let updatedPrompt = '';
  if (accessToken) {
    const prompt: any = getAllSavedRulesFromCtObj(accessToken, CTP_CUSTOM_OBJ_SEO_CONTAINER_NAME,
      CTP_CUSTOM_OBJ_SEO_CONTAINER_KEY,);
    const allEmpty = prompt?.value?.every((p: string) => /^\s*$/.test(p));

    // If any prompt is non-empty, update updatedPrompt
    if (!allEmpty) {
      updatedPrompt = prompt?.value?.join(' ');
    }
  }

  let contentString = `Find the SEO title and description for product with ${query}`;

  // Append rules to the content string if updatedPrompt is not empty
  if (updatedPrompt) {
    contentString += ` and Rules: ${updatedPrompt}`;
  } else {
    // Add fallback rules
    contentString += ` and Rules: Include the main keyword in both the title and description. Keep the title concise (50-60 characters) while making it compelling for clicks. Clearly communicate product benefits in the description to engage users and spark curiosity. Limit the description to under 150-160 characters for full visibility in search results.`;
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
    return error;
  }
};
