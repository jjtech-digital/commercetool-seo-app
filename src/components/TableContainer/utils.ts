import { getProducts } from "../../api/graphql/products";
import { IProduct } from "./TableContainer.types";

export const commonColumns = [
    {
      field: 'productKey',
      flex: 1,
      minWidth: 140,
      editable: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      valueGetter: (p: any) => {
        return p?.data?.key;
      },
    },
    {
      field: 'name',
      flex: 3.5,
      editable: false,
      valueGetter: (params: any) => {
        return params.data?.masterData?.current?.name;
      },
    },
  ];

export const performSearch = async (
    apiRoot,
    search,
    pageRelatedData,
    setState,
    setTableData,
    setTotalProductCount,
    setSearchPerformed
  ) => {
    const { dataLocale, perPage, offSet } = pageRelatedData
     setSearchPerformed(true);
    try {
      if (!search) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: 'Search field cannot be empty.',
          notificationMessageType: 'error',
        }));
        return;
      }
      if (!dataLocale) {
        throw new Error('Locale is not defined');
      }
      setState((prev: any) => ({ ...prev, pageLoading: true }));
      const data = await apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            [`text.${dataLocale}`]: search,
            limit: perPage?.value,
            offset: offSet,
          },
        })
        .execute();
      setState((prev: any) => ({ ...prev, pageLoading: false }));
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      setState((prev: any) => ({
        ...prev,
        pageLoading: false,
        notificationMessage: 'Search failed. Please try again later.',
        notificationMessageType: 'error',
      }));
    }
  };

// Helper function to fetch data
export const fetchProductData = async (
  apiRoot,
  dataLocale,
  pageData,
  setState,
  setTotalProductCount,
  setTableData,
  setSearchPerformed
) => {
  const { perPage, offSet } = pageData
  setSearchPerformed(false);
  try {
    setState((prev: any) => ({ ...prev, pageLoading: true }));
    const productsData = await apiRoot
      .graphql()
      .post({
        body: {
          query: getProducts(),
          variables: {
            limit: Number(perPage?.value),
            offset: Number(offSet),
            Locale: dataLocale,
          },
        },
      })
      .execute();
      const updatedTableData = productsData?.body?.data?.products?.results.map((row: IProduct) => ({
        ...row,
        isGenerating: false,
      }));
    setState((prev: any) => ({ ...prev, pageLoading: false }));
    setTotalProductCount(productsData?.body?.data?.products?.total);
    setTableData(updatedTableData);
  } catch (error) {
    console.error('Error fetching product data:', error);
    setState((state: any) => ({
      ...state,
      pageLoading: false,
      notificationMessage:
        'Error fetching product data. Please try again later.',
      notificationMessageType: 'error',
    }));
  }
};

export const removeDoubleQuotes = (text: string) => {
  if (text?.startsWith('"') && text?.endsWith('"')) {
    return text?.slice(1, -1);
  }
  return text;
};
