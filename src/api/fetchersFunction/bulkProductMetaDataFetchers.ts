import {
  queryProductOpenAi,
  updateProductMeta,
} from './productMetaDataFetchers';
import {
  batchSize,
  generateMetaData,
  openAiKey,
  processBatches,
  setNotification,
} from './utils';
export const bulkGenerateProductMetaData = async (
  secrets: any,
  productIds: string[],
  dataLocale: any,
  setState: Function
) => {
  if (!openAiKey) {
    setNotification(
      setState,
      'OpenAI key is missing. Please set it in the settings tab.',
      'error'
    );
    return null;
  }
  let productMetaDataResponses: any[] = [];

  const strings = {
    dataLocale: dataLocale,
    errorMessage:
      'Error generating product description and key features in batch.',
      secrets,
  };

  await processBatches(
    productIds,
    batchSize,
    strings,
    generateMetaData,
    queryProductOpenAi,
    setState,
    (data) => {
      productMetaDataResponses = [...productMetaDataResponses, ...data];
    }
  );

  return productMetaDataResponses;
};

export const applyBulkProductMeta = async (
  bulkSelectedProductsData: any[],
  dataLocale: any,
  secrets: any,
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
      keyFeatures: product.keyFeatures,
      description: product.description,
      version: product.version,
      dataLocale: dataLocale,
    }));
    try {
      const applyBulkPromises = batchData?.map(async (product) => {
        return await updateProductMeta(
          product?.productId,
          product?.keyFeatures,
          product?.description,
          product?.version,
          product?.dataLocale,
          secrets,
        );
      });
      const data = await Promise.all(applyBulkPromises);

      setState((prev: any) => ({
        ...prev,
        notificationMessage:
          'Product description and key features applied successfully.',
        notificationMessageType: 'success',
      }));

      applyBulkResponses = [...applyBulkResponses, ...data];
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage:
          'Error applying description and key features in batch.',
        notificationMessageType: 'error',
      }));
      console.error(
        'Error applying description and key features in batch:',
        error
      );
    }
  }
  return applyBulkResponses;
};
