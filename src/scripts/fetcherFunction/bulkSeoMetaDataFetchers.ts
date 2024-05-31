import axios from 'axios';
import { apiBaseUrl } from '../../constants';

export const bulkGenerateSeoMetaData = async (
  productIds: string[],
  dataLocale: any,
  setState: Function
) => {
  const accessToken = localStorage.getItem('token');
  const openAiKey = localStorage.getItem('openAIKey');
  if (!openAiKey) {
    setState((prev: any) => ({
      ...prev,
      notificationMessage:
        'OpenAI key is missing. Please set it in the settings.',
      notificationMessageType: 'error',
    }));
    return null;
  }
  const batchSize = 20;
  const totalBatches = Math.ceil(productIds.length / batchSize);
  let metaDataResponses: any[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, productIds.length);
    const batchIds = productIds.slice(start, end);

    const body = {
      ids: batchIds,
      token: accessToken,
      locale: dataLocale,
      openAiKey: openAiKey,
    };

    try {
      const response = await axios.post(
        `${apiBaseUrl}/products/bulk-generate-meta-data`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const has401Error = response?.data?.some((res: any) => res?.data?.status === 401);
      if (has401Error) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: "Incorrect API key provided",
          notificationMessageType: 'error',
        }));
        return null; 
      }
      metaDataResponses = [...metaDataResponses, ...response.data];
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'Error generating SEO metadata in batch.',
        notificationMessageType: 'error',
      }));
      console.error('Error generating SEO metadata in batch:', error);
    }
  }

  return metaDataResponses;
};

export const applyBulkProductSeoMeta = async (
  bulkSelectedProductsData: any[],
  dataLocale: any,
  setState: Function
) => {
  const accessToken = localStorage.getItem('token');
  const batchSize = 20; // Define your batch size
  const totalBatches = Math.ceil(bulkSelectedProductsData.length / batchSize);
  let responses: any[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, bulkSelectedProductsData.length);
    const batchProducts = bulkSelectedProductsData.slice(start, end);

    const batchData = batchProducts.map((product) => ({
      productId: product.productId,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      version: product.version,
      dataLocale: dataLocale,
    }));
    const body = {
      products: batchData,
      token: accessToken,
    };

    try {
      const response = await axios.post(
        `${apiBaseUrl}/products/bulk-update-seo-meta`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      responses = [...responses, ...response.data];
      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'SEO meta applied successfully.',
        notificationMessageType: 'success',
      }));
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'Error applying SEO meta in batch.',
        notificationMessageType: 'error',
      }));
      console.error('Error applying SEO meta in batch:', error);
    }
  }
  return responses;
};
