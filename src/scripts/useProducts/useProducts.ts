import { getAllProducts } from '../fetcherFunction/productFetchers';
import {
  generateSeoMetaData,
  updateProductSeoMeta,
} from '../fetcherFunction/seoMetaDataFetchers';

export function useProducts() {
  const getAllProductsData = async (
    limit: number,
    offset: number,
    dataLocale:string | null,
    setState: Function
  ) => {
    const response = await getAllProducts(limit, offset,dataLocale, setState);
    return response;
  };

  const getSeoMetaData = async (productId: string,  dataLocale: string| null, setState:Function) => { 
    const response = await generateSeoMetaData(productId, dataLocale,setState);
    return response;
  };
  const updateProductSeoMetaData = async (
    productId: string,
    metaTitle: string,
    metaDescription: string,
    version: number,
    dataLocale: string| null,
    setState: Function
  ) => {
    const response = await updateProductSeoMeta(
      productId,
      metaTitle,
      metaDescription,
      version,
      dataLocale,
      setState
    );
    return response;
  };
  return { getAllProductsData, getSeoMetaData, updateProductSeoMetaData };
}
