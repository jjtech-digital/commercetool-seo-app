import { queryOpenAi, updateProductSeoMeta } from './seoMetaDataFetchers';
import {
  batchSize,
  generateMetaData,
  openAiKey,
  processBatches,
  setNotification,
} from './utils';
export const bulkGenerateSeoMetaData = async (
  secrets: any,
  productIds: string[],
  dataLocale: any,
  setState: Function
) => {
  if (!openAiKey) {
    setNotification(
      setState,
      'OpenAI key is missing. Please set it in the settings.',
      'error'
    );
    return null;
  }
  let metaDataResponses: any[] = [];

  const strings = {
    dataLocale: dataLocale,
    errorMessage: 'Error generating SEO metadata in batch.',
    secrets,
  };

  await processBatches(
    productIds,
    batchSize,
    strings,
    generateMetaData,
    queryOpenAi,
    setState,
    (data) => {
      metaDataResponses = [...metaDataResponses, ...data];
    }
  );

  return metaDataResponses;
};

export const applyBulkProductSeoMeta = async (
  secrets: any,
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
      const applyBulkSeoPromises = batchData?.map(async (product) => {
        return await updateProductSeoMeta(
          secrets,
          product?.productId,
          product?.metaTitle,
          product?.metaDescription,
          product?.version,
          product?.dataLocale
        );
      });
      const data = await Promise.all(applyBulkSeoPromises);

      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'SEO metadata applied successfully.',
        notificationMessageType: 'success',
      }));

      applyBulkResponses = [...applyBulkResponses, ...data];
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'Error applying SEO metadata in batch.',
        notificationMessageType: 'error',
      }));
      console.error('Error applying SEO metadata in batch:', error);
    }
  }
  return applyBulkResponses;
};
