import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { IProduct, IResponseFromAi } from './TableContainer.types';
import { useAppContext } from '../../context/AppContext';
import apiRoot from '../../api/apiRoot';
import { fetchProductData, performSearch, removeDoubleQuotes } from './utils';
import GridContainer from './GridContainer';
import { defaultSeoColumns } from './ColumnsData';
import {
  handleSeoBulkGenerateClick,
  handleSeoBulkApplyClick,
} from '../../api/fetchersFunction/bulkMetaDataFetchers';
import ActionRendererSEO from '../Renderers/ActionRendererSEO';

const TableContainer = () => {
  const [seoTableData, setSeoTableData] = useState<IProduct[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>();
  const [seoSearch, setSeoSearch] = useState('');
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [seoSelectedRows, setSeoSelectedRows] = useState<IProduct[] | null>([]);
  const [seoResponseFromAi, setSeoResponseFromAi] = useState<IResponseFromAi>({
    id: null,
    title: null,
    description: null,
    version: null,
  });
  // we might need this later
  // const [gridApi, setGridApi] = useState(null);
  // const [columnApi, setColumnApi] = useState(null);
  // const onGridReady = (params: any) => {
  //   setGridApi(params.api);
  //   setColumnApi(params.columnApi);
  // };
  
  const seoGridRef = useRef<AgGridReact>(null);

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  const CTP_API_URL = useApplicationContext(
    (context) => context.environment.apiUrl
  );
  const CTP_PROJECT_KEY = useApplicationContext(
    (context) => context.environment.projectKey
  );
  const secrets = {
    CTP_API_URL,
    CTP_PROJECT_KEY,
  };
  const components = useMemo(
    () => ({
      actionRenderer: ActionRendererSEO,
    }),
    []
  );

  const { page, perPage } = usePaginationState();
  const { state, setState } = useAppContext();
  const offSet = (page?.value - 1) * perPage?.value;

  const colDefs = [
    ...defaultSeoColumns,
    {
      headerName: 'Actions',
      field: 'productKey',
      flex: 2,
      editable: false,
      minWidth: 200,
      sortable: false,
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        setResponseFromAi: setSeoResponseFromAi,
        gridRef: seoGridRef,
      },
    },
  ];

  const context = useMemo<any>(() => {
    return {
      loadingOverlayMessage: 'Loading',
    };
  }, []);

  const onSelectionChanged = useCallback(() => {
    let getSelectedRows = seoGridRef.current!.api.getSelectedRows();
    setSeoSelectedRows(getSelectedRows);
  }, [offSet, perPage?.value]);

  const pageRelatedData = {
    dataLocale: dataLocale,
    offSet: offSet,
    perPage: perPage,
  };

  const handleSeoSearch = async () => {
    const data = await performSearch(
      apiRoot,
      seoSearch,
      pageRelatedData,
      setState,
      setSeoTableData,
      setTotalProductsCount,
      setIsSearchPerformed
    );
    if (data) {
      const filteredData = data.body.results.map((product: any) => {
        const nameInCurrentLocale = product.name?.[dataLocale || 'en'];
        const metaTitleInCurrentLocale =
          product.metaTitle?.[dataLocale || 'en'];
        const metaDescriptionInCurrentLocale =
          product.metaDescription?.[dataLocale || 'en'];

        return {
          id: product.id,
          version: product.version,
          key: product.key,
          masterData: {
            current: {
              name: nameInCurrentLocale,
              metaTitle: metaTitleInCurrentLocale,
              metaDescription: metaDescriptionInCurrentLocale,
            },
          },
        };
      });
      setSeoTableData(filteredData);
      setTotalProductsCount(data.body.total);
    }
  };

  const pageData = {
    perPage,
    offSet,
  };

  const fetchSeoData = async (): Promise<void> => {
    await fetchProductData(
      apiRoot,
      dataLocale,
      pageData,
      setState,
      setTotalProductsCount,
      setSeoTableData,
      setIsSearchPerformed
    );
  };

  useEffect(() => {
    if (
      seoResponseFromAi?.id &&
      seoResponseFromAi?.title &&
      seoResponseFromAi?.description &&
      seoResponseFromAi?.version
    ) {
      const updatedTableData = [...seoTableData];
      const index = updatedTableData.findIndex(
        (item) => item.id === seoResponseFromAi.id
      );
      if (index !== -1) {
        const cleanedTitle = removeDoubleQuotes(seoResponseFromAi.title);
        const cleanedDescription = removeDoubleQuotes(
          seoResponseFromAi.description
        );
        updatedTableData[index].masterData.current.metaTitle = cleanedTitle;
        updatedTableData[index].masterData.current.metaDescription =
          cleanedDescription;
        updatedTableData[index].version = seoResponseFromAi.version;
        setSeoTableData(updatedTableData);
      }
    }
  }, [seoResponseFromAi]);

  const searchBoxText =
    'Search by Product key, Name, Seo title or Seo description';

  const strings = {
    dataLocale, secrets
  }
  return (
    <GridContainer
      search={seoSearch}
      setSearch={setSeoSearch}
      handleSearch={handleSeoSearch}
      fetchData={fetchSeoData}
      selectedRows={seoSelectedRows}
      handleBulkGenerateClick={() =>
        handleSeoBulkGenerateClick(
          strings,
          context,
          seoGridRef,
          seoSelectedRows,
          setState,
          seoTableData,
          setSeoTableData
        )
      }
      handleBulkApplyClick={() =>
        handleSeoBulkApplyClick(
          strings,
          seoSelectedRows,
          context,
          seoGridRef,
          setState,
          seoTableData,
          setSeoTableData
        )
      }
      gridRef={seoGridRef}
      state={state}
      tableData={seoTableData}
      colDefs={colDefs}
      onSelectionChanged={onSelectionChanged}
      context={context}
      totalProductCount={totalProductsCount}
      page={page}
      perPage={perPage}
      searchPerformed={isSearchPerformed}
      searchboxPlaceholder={searchBoxText}
      components={components}
    />
  );
};
export default TableContainer;
