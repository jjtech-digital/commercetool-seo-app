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
import { defaultDescColumns } from './ColumnsData';
import {
  handleDescBulkApplyClick,
  handleDescBulkGenerateClick,
} from '../../api/fetchersFunction/bulkMetaDataFetchers';
import ActionRendererProductInformation from '../Renderers/ActionRendererProductInformation';
const DescriptionTableContainer = () => {
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
  const [tableData, setTableData] = useState<IProduct[]>([]);
  const [totalProductCount, setTotalProductCount] = useState<number>();
  const [search, setSearch] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedRows, setSelectedRows] = useState<IProduct[] | null>([]);
  const [responseFromAi, setResponseFromAi] = useState<IResponseFromAi>({
    id: null,
    keyFeatures: null,
    description: null,
    version: null,
  });
  // we might need this later
  // const [gridApi, setGridApi] = useState(null);
  // const [columnApi, setColumnApi] = useState(null);
  // const onGridReady = (params: any) => {
  //   setGridApi(params.api)
  //   setColumnApi(params.columnApi)
  // };
  const gridRef = useRef<AgGridReact>(null);

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const components = useMemo(
    () => ({
      actionRenderer: ActionRendererProductInformation,
    }),
    []
  );

  const { page, perPage } = usePaginationState();
  const { state, setState } = useAppContext();
  const offSet = (page?.value - 1) * perPage?.value;

  const colDefs = [
    ...defaultDescColumns,
    {
      headerName: 'Actions',
      field: 'productKey',
      flex: 2,
      editable: false,
      minWidth: 200,
      sortable: false,
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        setResponseFromAi: setResponseFromAi,
        gridRef: gridRef,
      },
    },
  ];
  const context = useMemo<any>(() => {
    return {
      loadingOverlayMessage: 'Loading',
    };
  }, []);

  const onSelectionChanged = useCallback(() => {
    let getSelectedRows = gridRef.current!.api.getSelectedRows();
    setSelectedRows(getSelectedRows);
  }, [offSet, perPage?.value]);

  const pageRelatedData = {
    dataLocale: dataLocale,
    offSet: offSet,
    perPage: perPage,
  };

  const handleSearch = async () => {
    const data = await performSearch(
      apiRoot,
      search,
      pageRelatedData,
      setState,
      setTableData,
      setTotalProductCount,
      setSearchPerformed
    );
    if (data) {
      const filteredData = data.body.results.map((product: any) => {
        const keyFeatures = product.masterVariant.attributes.find(
          (item: any) => item.name === 'features'
        );
        const features = keyFeatures?.value[0][dataLocale] || '';
        const description = product.description || '';
        const nameInCurrentLocale = product.name?.[dataLocale];

        return {
          id: product.id,
          version: product.version,
          key: product.key,
          masterData: {
            current: {
              name: nameInCurrentLocale,
              description: description?.[dataLocale],
              masterVariant: {
                attributesRaw: [
                  {
                    name: 'features',
                    value: [{ [dataLocale]: features }],
                  },
                ],
              },
            },
          },
        };
      });
      setTableData(filteredData);
      setTotalProductCount(data.body.total);
    }
  };

  const pageData = {
    perPage,
    offSet,
  };

  const fetchData = async (): Promise<void> => {
    await fetchProductData(
      apiRoot,
      dataLocale,
      pageData,
      setState,
      setTotalProductCount,
      setTableData,
      setSearchPerformed
    );
  };

  useEffect(() => {
    if (
      responseFromAi?.id &&
      responseFromAi?.description &&
      responseFromAi?.version
    ) {
      let keyFeats = responseFromAi?.keyFeatures || ' ';
      const updatedTableData = [...tableData];
      const index = updatedTableData.findIndex(
        (item) => item.id === responseFromAi.id
      );
      if (index !== -1) {
        const cleanedFeatures = removeDoubleQuotes(keyFeats);
        const cleanedDescription = removeDoubleQuotes(
          responseFromAi.description
        );
        const attributesRaw =
          updatedTableData[index].masterData.current.masterVariant
            .attributesRaw;
        let features = attributesRaw.find(
          (item: any) => item.name === 'features'
        );
        let featureDatalocale = dataLocale;
        if (!features) {
          features = { name: 'features', value: [{ [featureDatalocale]: '' }] };
          attributesRaw.push(features);
        }
        if(features.value.length === 0 ){
          features.value = [{ [featureDatalocale]: cleanedFeatures }]
        }
        if (features?.value) {
          features.value[0][featureDatalocale] = cleanedFeatures;
        }

        updatedTableData[index].masterData.current.description =
          cleanedDescription;
        updatedTableData[index].version = responseFromAi.version;
        setTableData(updatedTableData);
      }
    }
  }, [responseFromAi, dataLocale]);

  const searchBoxText = 'Search by Product key, Name, description';

  const strings = { 
    dataLocale, secrets
  }

  return (
    <GridContainer
      search={search}
      setSearch={setSearch}
      handleSearch={handleSearch}
      fetchData={fetchData}
      selectedRows={selectedRows}
      handleBulkGenerateClick={() =>
        handleDescBulkGenerateClick(
          strings,
          context,
          gridRef,
          selectedRows,
          setState,
          tableData,
          setTableData
        )
      }
      handleBulkApplyClick={() =>
        handleDescBulkApplyClick(
          strings,
          selectedRows,
          setState,
          context,
          gridRef,
          tableData,
          setTableData,
         
        )
      }
      gridRef={gridRef}
      state={state}
      tableData={tableData}
      colDefs={colDefs}
      onSelectionChanged={onSelectionChanged}
      context={context}
      totalProductCount={totalProductCount}
      page={page}
      perPage={perPage}
      searchPerformed={searchPerformed}
      searchboxPlaceholder={searchBoxText}
      components={components}
    />
  );
};
export default DescriptionTableContainer;
