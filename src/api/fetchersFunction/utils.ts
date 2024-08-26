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
  secrets: any,
  id: string,
  dataLocale: string,
  openAiFunction: Function
) => Promise<any>;

export const processBatches = async (
  productIds: string[],
  batchSize: number,
  strings: {
    dataLocale: string;
    errorMessage: string;
    secrets: any,
  },
  generateMetaData: GenerateMetaDataFunction,
  queryOpenAi: Function,
  setState: Function,
  successHandler: (data: any[]) => void
) => {
  const totalBatches = Math.ceil(productIds?.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, productIds.length);
    const batchIds = productIds.slice(start, end);

    try {
      const response = batchIds.map(async (id) => {
        return await generateMetaData(
          strings.secrets,
          id,
          strings?.dataLocale,
          queryOpenAi
        );
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
        notificationMessage: strings.errorMessage,
        notificationMessageType: 'error',
      }));
      console.error(strings.errorMessage, error);
    }
  }
};

export const matchData = (response: any) => {
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

export const seoMatchData = (response: any) => {
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

export const generateMetaData = async (
  secrets: any,
  productId: string,
  dataLocale: any,
  openAiFunction: Function,
  setState?: Function
) => {
  const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);
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
    const attributes = productResponse?.masterData?.current?.masterVariant?.attributesRaw
    const attributesJson = attributes?.reduce((acc : any, attr : any) => {
      attr.value !== "" &&
      acc.push({ [attr.name]: attr.value });
      return acc;
    }, []);
    const attributesString = JSON.stringify(attributesJson);

    const categoryNames = categories
      ?.map((category: any) => category?.name)
      ?.join(', ');
    const query = `Product name: "${productName}", Categories: "${categoryNames}", Attributes : "${attributesString}`;

    const localeQuery = dataLocale ? `, Locale: "${dataLocale}"` : '';
    const data: any = await openAiFunction(
      secrets,
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
    console.error('Error generating metadata for productID:', productId, error);

    setState?.((prev: any) => ({
      ...prev,
      notificationMessage: 'Error generating metadata.',
      notificationMessageType: 'error',
    }));
    return null;
  }
};
