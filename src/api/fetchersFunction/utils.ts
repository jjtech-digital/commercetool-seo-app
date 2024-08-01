import {
  LS_KEY,
  descriptionPattern,
  featuresPattern,
  normalDescPattern,
  titlePattern,
} from '../../constants';
import apiRoot from '../apiRoot';
import { getProductDetails } from '../graphql/productDetails';

export const openAiKey = localStorage.getItem(LS_KEY.OPEN_AI_KEY);
export const setNotification = (
  setState: Function,
  message: string,
  type: string
) => {
  setState((prev: any) => ({
    ...prev,
    notificationMessage: message,
    notificationMessageType: type,
  }));
};

export const batchSize = 20;

type GenerateMetaDataFunction = (
  id: string,
  dataLocale: string
) => Promise<any>;

export const processBatches = async (
  productIds: string[],
  batchSize: number,
  dataLocale: string,
  generateMetaData: GenerateMetaDataFunction,
  setState: Function,
  successHandler: (data: any[]) => void,
  errorMessage: string
) => {
  const totalBatches = Math.ceil(productIds?.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, productIds.length);
    const batchIds = productIds.slice(start, end);

    try {
      const response = batchIds.map(async (id) => {
        return await generateMetaData(id, dataLocale);
      });

      const data = await Promise.all(response);
      const has401Error = data?.some((res: any) => res?.data?.status === 401);
      if (has401Error) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: 'Incorrect API key provided',
          notificationMessageType: 'error',
        }));
        return null;
      }

      successHandler(data);
      return data;
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage: errorMessage,
        notificationMessageType: 'error',
      }));
      console.error(errorMessage, error);
    }
  }
};

export const matchData = (response) => {
  const metaData = response?.choices?.[0]?.message?.content;

  const featuresMatch = metaData?.match(featuresPattern);
  const keyFeatures = featuresMatch ? featuresMatch[1].trim() : null;

  const descriptionMatch = metaData?.match(normalDescPattern);
  const description = descriptionMatch ? descriptionMatch[1].trim() : null;
  return {
    keyFeatures,
    description,
  };
};

export const seoMatchData = (response) => {
  const message = response?.choices?.[0]?.message?.content;
  const titleMatch = message?.match(titlePattern);
  const title = titleMatch ? titleMatch[2]?.trim() : null;

  const descriptionMatch = message?.match(descriptionPattern);
  const description = descriptionMatch ? descriptionMatch[2]?.trim() : null;
  return {
    title,
    description,
  };
};

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