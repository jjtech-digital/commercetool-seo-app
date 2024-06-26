import { LS_KEY } from '../../constants';
import {
  generateSeoMetaData,
  updateProductSeoMeta,
} from './seoMetaDataFetchers';
export const bulkGenerateSeoMetaData = async (
  productIds: string[],
  dataLocale: any,
  setState: Function
) => {
  const openAiKey = localStorage.getItem(LS_KEY.OPEN_AI_KEY);
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
  const totalBatches = Math.ceil(productIds?.length / batchSize);
  let metaDataResponses: any[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, productIds.length);
    const batchIds = productIds.slice(start, end);

    try {
      const response: any = batchIds.map(async (id) => {
        return await generateSeoMetaData(id, dataLocale);
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

      metaDataResponses = [...metaDataResponses, ...data];
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
  const batchSize = 20; // Define your batch size
  const totalBatches = Math.ceil(bulkSelectedProductsData?.length / batchSize);
  let applyBulkResponses: any[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, bulkSelectedProductsData?.length);
    const batchProducts = bulkSelectedProductsData?.slice(start, end);

    const batchData = batchProducts?.map((product) => ({
      productId: product.productId,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      version: product.version,
      dataLocale: dataLocale,
    }));

    try {
      const applyBulkPromises = batchData?.map(async (product) => {
        return await updateProductSeoMeta(
          product?.productId,
          product?.metaTitle,
          product?.metaDescription,
          product?.version,
          product?.dataLocale
        );
      });
      const data = await Promise.all(applyBulkPromises);

      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'SEO meta applied successfully.',
        notificationMessageType: 'success',
      }));

      applyBulkResponses = [...applyBulkResponses, ...data];
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'Error applying SEO meta in batch.',
        notificationMessageType: 'error',
      }));
      console.error('Error applying SEO meta in batch:', error);
    }
  }
  return applyBulkResponses;
};
