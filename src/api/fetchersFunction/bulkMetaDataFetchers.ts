import { IProduct } from "../../components/TableContainer/TableContainer.types";
import { removeDoubleQuotes } from "../../components/TableContainer/utils";
import { descriptionPattern, featuresPattern, normalDescPattern, titlePattern } from "../../constants";
import { applyBulkProductMeta, bulkGenerateProductMetaData } from "./bulkProductMetaDataFetchers";
import { bulkGenerateSeoMetaData, applyBulkProductSeoMeta } from "./bulkSeoMetaDataFetchers";

export const handleDescBulkGenerateClick = async (context,gridRef, selectedRows, dataLocale, setState, tableData, setTableData) => {
    context.loadingOverlayMessage =
      'Generating description and key features for selected products. This may take some time';
    gridRef.current!.api.showLoadingOverlay();

    const bulkProductIds: any = selectedRows?.map((products : IProduct) => products?.id);
    const aiBulkResponse = await bulkGenerateProductMetaData(
      bulkProductIds,
      dataLocale,
      setState
    );

    const updatedTableData = [...tableData];

    aiBulkResponse?.forEach((response) => {
      const metaData = response?.choices?.[0]?.message?.content;

      const featuresMatch = metaData?.match(featuresPattern);
      const keyFeatures = featuresMatch ? featuresMatch[1].trim() : null;

      const descriptionMatch = metaData?.match(normalDescPattern);
      const description = descriptionMatch ? descriptionMatch[1].trim() : null;

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

    gridRef.current!.api.hideOverlay();
    context.loadingOverlayMessage = 'Loading';
  };
export const handleDescBulkApplyClick = async (dataLocale, selectedRows,setState, context,gridRef, tableData, setTableData) => {
    const featuredDataLocale = dataLocale || 'en';
    const hasEmptyMeta = selectedRows?.some(
      (product : IProduct) => !product.masterData.current.description
    );
    if (hasEmptyMeta) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage:
          'Description cannot be empty for selected products.',
        notificationMessageType: 'error',
      }));
    } else {
      const bulkSelectedProductsData: any = selectedRows?.map((product : IProduct) => ({
        productId: product?.id,
        keyFeatures:
          product?.masterData?.current?.masterVariant.attributesRaw.find(
            (item: any) => item.name === 'features'
          ).value[0][featuredDataLocale],
        description: product?.masterData?.current?.description,
        version: product?.version,
      }));
      context.loadingOverlayMessage =
        'Applying description and key features for selected products. This may take some time';
      gridRef.current!.api.showLoadingOverlay();

      const res: any = await applyBulkProductMeta(
        bulkSelectedProductsData,
        dataLocale,
        setState
      );

      if (res) {
        const updatedTableData = [...tableData];

        res.forEach((updatedProduct: any) => {
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
    }
  };


export const handleSeoBulkGenerateClick = async (context,gridRef,selectedRows, dataLocale, setState, tableData, setTableData) => {
    context.loadingOverlayMessage =
      'Generating SEO metadata for selected products. This may take some time';
    gridRef.current!.api.showLoadingOverlay();

    const bulkProductIds: any = selectedRows?.map((products : IProduct) => products?.id);
    const aiBulkResponse = await bulkGenerateSeoMetaData(
      bulkProductIds,
      dataLocale,
      setState
    );

    const updatedTableData = [...tableData];

    aiBulkResponse?.forEach((response) => {
      const message = response?.choices?.[0]?.message?.content;
      const titleMatch = message?.match(titlePattern);
      const title = titleMatch ? titleMatch[2]?.trim() : null;

      const descriptionMatch = message?.match(descriptionPattern);
      const description = descriptionMatch ? descriptionMatch[2]?.trim() : null;
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

    gridRef.current!.api.hideOverlay();
    context.loadingOverlayMessage = 'Loading';
  };

export const handleSeoBulkApplyClick = async (selectedRows, context, gridRef, dataLocale, setState,tableData, setTableData) => {
    const hasEmptyMeta = selectedRows?.some(
      (product) =>
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
      const bulkSelectedProductsData: any = selectedRows?.map((product : IProduct) => ({
        productId: product?.id,
        metaTitle: product?.masterData?.current?.metaTitle,
        metaDescription: product?.masterData?.current?.metaDescription,
        version: product?.version,
      }));
      context.loadingOverlayMessage =
        'Applying SEO meta for selected products. This may take some time';
      gridRef.current!.api.showLoadingOverlay();

      const res: any = await applyBulkProductSeoMeta(
        bulkSelectedProductsData,
        dataLocale,
        setState
      );

      if (res) {
        const updatedTableData = [...tableData];

        res.forEach((updatedProduct: any) => {
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
    }
  };
