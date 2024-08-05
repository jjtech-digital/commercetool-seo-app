import { IProduct } from '../../components/TableContainer/TableContainer.types';
import { removeDoubleQuotes } from '../../components/TableContainer/utils';
import {
  applyBulkProductMeta,
  bulkGenerateProductMetaData,
} from './bulkProductMetaDataFetchers';
import {
  bulkGenerateSeoMetaData,
  applyBulkProductSeoMeta,
} from './bulkSeoMetaDataFetchers';
import { matchData, seoMatchData } from './utils';

export const handleDescBulkGenerateClick = async (
  strings: any,
  context: any,
  gridRef: any,
  selectedRows: IProduct[] | null,
  setState: Function,
  tableData: IProduct[],
  setTableData: Function
) => {
  const { dataLocale, secrets } = strings;
  const selectedNodes = gridRef.current!.api.getSelectedNodes();
  context.loadingOverlayMessage =
    'Generating description and key features for selected products. This may take some time';
  gridRef.current!.api.showLoadingOverlay();

  const bulkProductIds: any = selectedRows?.map(
    (products: IProduct) => products?.id
  );
  const aiBulkResponse = await bulkGenerateProductMetaData(
    secrets,
    bulkProductIds,
    dataLocale,
    setState
  );

  const updatedTableData = [...tableData];

  aiBulkResponse?.forEach((response) => {
    const matchDataResponse = matchData(response);
    const { keyFeatures, description } = matchDataResponse;
    const cleanedKeyFeatures = removeDoubleQuotes(keyFeatures);
    const cleanedDescription = removeDoubleQuotes(description);

    const index = updatedTableData.findIndex(
      (item) => item.id === response?.productId
    );
    if (index !== -1) {
      const attributesRaw =
        updatedTableData[index].masterData.current?.masterVariant
          ?.attributesRaw;
      let features = attributesRaw.find(
        (item: any) => item.name === 'features'
      );
      let featureDatalocale = dataLocale || 'en';
      if (!features) {
        features = { name: 'features', value: [{ [featureDatalocale]: '' }] };
        attributesRaw.push(features);
      }
      if (features?.value[0]) {
        features.value[0][featureDatalocale] = cleanedKeyFeatures;
      }
      updatedTableData[index].masterData.current.description =
        cleanedDescription;
    }
  });

  setTableData(updatedTableData);

  setTimeout(() => {
    selectedNodes.forEach((node: any) => {
      gridRef.current!.api.getRowNode(node.id)?.setSelected(true);
    });
  }, 0);

  gridRef.current!.api.hideOverlay();
  context.loadingOverlayMessage = 'Loading';
};

export const handleSeoBulkGenerateClick = async (
  strings: any,
  context: any,
  gridRef: any,
  selectedRows: IProduct[] | null,
  setState: Function,
  tableData: IProduct[],
  setTableData: Function
) => {
  const { dataLocale, secrets } = strings
  const selectedNodes = gridRef.current!.api.getSelectedNodes();
  context.loadingOverlayMessage =
    'Generating SEO metadata for selected products. This may take some time';
  gridRef.current!.api.showLoadingOverlay();

  const bulkProductIds: any = selectedRows?.map(
    (products: IProduct) => products?.id
  );
  const aiBulkResponse = await bulkGenerateSeoMetaData(
    secrets,
    bulkProductIds,
    dataLocale,
    setState
  );

  const updatedTableData = [...tableData];

  aiBulkResponse?.forEach((response) => {
    const responseData = seoMatchData(response);
    const { title, description } = responseData;
    const cleanedTitle = removeDoubleQuotes(title);
    const cleanedDescription = removeDoubleQuotes(description);

    const index = updatedTableData.findIndex(
      (item) => item.id === response?.productId
    );
    if (index !== -1) {
      updatedTableData[index].masterData.current.metaTitle = cleanedTitle;
      updatedTableData[index].masterData.current.metaDescription =
        cleanedDescription;
    }
  });

  setTableData(updatedTableData);

  setTimeout(() => {
    selectedNodes.forEach((node: any) => {
      gridRef.current!.api.getRowNode(node.id)?.setSelected(true);
    });
  }, 0);

  gridRef.current!.api.hideOverlay();
  context.loadingOverlayMessage = 'Loading';
};

export const dataApplication = (
  response: any,
  tableData: IProduct[],
  setTableData: Function,
  gridRef: any,
  context: any
) => {
  if (response) {
    const updatedTableData = [...tableData];

    response.forEach((updatedProduct: any) => {
      const index = updatedTableData?.findIndex(
        (item) => item?.id === updatedProduct?.id
      );
      if (index !== -1) {
        updatedTableData[index].version = updatedProduct?.version;
      }
    });

    setTableData(updatedTableData);
  }

  gridRef.current!.api.hideOverlay();
  context.loadingOverlayMessage = 'Loading';
};
export const handleDescBulkApplyClick = async (
  strings: any,
  selectedRows: IProduct[] | null,
  setState: Function,
  context: any,
  gridRef: any,
  tableData: IProduct[],
  setTableData: Function
) => {
  const { dataLocale, secrets } = strings;
  const featuredDataLocale = dataLocale || 'en';
  const hasEmptyMeta = selectedRows?.some(
    (product: IProduct) => !product.masterData.current.description
  );
  if (hasEmptyMeta) {
    setState((prev: any) => ({
      ...prev,
      notificationMessage: 'Description cannot be empty for selected products.',
      notificationMessageType: 'error',
    }));
  } else {
    const bulkSelectedProductsData: any = selectedRows?.map(
      (product: IProduct) => ({
        productId: product?.id,
        keyFeatures:
          product?.masterData?.current?.masterVariant.attributesRaw.find(
            (item: any) => item.name === 'features'
          ).value[0][featuredDataLocale],
        description: product?.masterData?.current?.description,
        version: product?.version,
      })
    );
    context.loadingOverlayMessage =
      'Applying description and key features for selected products. This may take some time';
    gridRef.current!.api.showLoadingOverlay();

    const res: any = await applyBulkProductMeta(
      bulkSelectedProductsData,
      dataLocale,
      secrets,
      setState
    );

    dataApplication(res, tableData, setTableData, gridRef, context);
  }
};

export const handleSeoBulkApplyClick = async (
  strings: any,
  selectedRows: IProduct[] | null,
  context: any,
  gridRef: any,
  
  setState: Function,
  tableData: IProduct[],
  setTableData: Function
) => {
  const { dataLocale, secrets } = strings
  const hasEmptyMeta = selectedRows?.some(
    (product: IProduct) =>
      !product.masterData.current.metaTitle ||
      !product.masterData.current.metaDescription
  );
  if (hasEmptyMeta) {
    setState((prev: any) => ({
      ...prev,
      notificationMessage:
        'SEO Title or description cannot be empty for selected products.',
      notificationMessageType: 'error',
    }));
  } else {
    const bulkSelectedProductsData: any = selectedRows?.map(
      (product: IProduct) => ({
        productId: product?.id,
        metaTitle: product?.masterData?.current?.metaTitle,
        metaDescription: product?.masterData?.current?.metaDescription,
        version: product?.version,
      })
    );
    context.loadingOverlayMessage =
      'Applying SEO meta for selected products. This may take some time';
    gridRef.current!.api.showLoadingOverlay();

    const res: any = await applyBulkProductSeoMeta(
      secrets,
      bulkSelectedProductsData,
      dataLocale,
      setState
    );
    dataApplication(res, tableData, setTableData, gridRef, context);
  }
};
