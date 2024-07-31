import { LS_KEY } from '../../constants';
import { generateProductMetaData, updateProductMeta } from './productMetaDataFetchers';
export const bulkGenerateProductMetaData = async (
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
  let productMetaDataResponses: any[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, productIds.length);
    const batchIds = productIds.slice(start, end);

    try {
      const response: any = batchIds.map(async (id) => {
        return await generateProductMetaData(id, dataLocale);
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

      productMetaDataResponses = [...productMetaDataResponses, ...data];
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'Error generating product description and key features in batch.',
        notificationMessageType: 'error',
      }));
      console.error('Error generating product description and key features in batch:', error);
    }
  }

  return productMetaDataResponses;
};

export const applyBulkProductMeta = async (
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
          product?.dataLocale
        );
      });
      const data = await Promise.all(applyBulkPromises);

      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'Product meta applied successfully.',
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
