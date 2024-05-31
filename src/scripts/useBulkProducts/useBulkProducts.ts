import {
  applyBulkProductSeoMeta,
  bulkGenerateSeoMetaData,
} from '../fetcherFunction/bulkSeoMetaDataFetchers';

export function useBulkProducts() {
  const getBulkSeoMetaData = async (
    productIds: string[],
    dataLocale: string | null,
    setState: Function
  ) => {
    const response = await bulkGenerateSeoMetaData(
      productIds,
      dataLocale,
      setState
    );
    return response;
  };
  const applyBulkProducts = async (
    bulkSelectedProductsData: any,
    dataLocale: string | null,
    setState: Function
  ) => {
    const response = await applyBulkProductSeoMeta(
      bulkSelectedProductsData,
      dataLocale,
      setState
    );
    return response;
  };

  return {
    getBulkSeoMetaData,
    applyBulkProducts,
  };
}
