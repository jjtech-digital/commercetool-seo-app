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
import { handleSeoBulkGenerateClick, handleSeoBulkApplyClick } from '../../api/fetchersFunction/bulkMetaDataFetchers';

const TableContainer = () => {
  const [tableData, setTableData] = useState<IProduct[]>([]);
  const [totalProductCount, setTotalProductCount] = useState<number>();
  const [search, setSearch] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedRows, setSelectedRows] = useState<IProduct[] | null>([]);
  const [responseFromAi, setResponseFromAi] = useState<IResponseFromAi>({
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
  const gridRef = useRef<AgGridReact>(null);

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

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

  const handleSearch = async () => {
    const data = await performSearch(
      apiRoot,
      dataLocale,
      search,
      perPage,
      offSet,
      setState,
      setTableData,
      setTotalProductCount,
      setSearchPerformed
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
      setTableData(filteredData);
      setTotalProductCount(data.body.total);
    }
  };

  const fetchData = async () => {
    await fetchProductData(
      apiRoot,
      dataLocale,
      perPage,
      offSet,
      setState,
      setTotalProductCount,
      setTableData,
      setSearchPerformed
    );
  };

  useEffect(() => {
    if (
      responseFromAi?.id &&
      responseFromAi?.title &&
      responseFromAi?.description &&
      responseFromAi?.version
    ) {
      const updatedTableData = [...tableData];
      const index = updatedTableData.findIndex(
        (item) => item.id === responseFromAi.id
      );
      if (index !== -1) {
        const cleanedTitle = removeDoubleQuotes(responseFromAi.title);
        const cleanedDescription = removeDoubleQuotes(
          responseFromAi.description
        );
        updatedTableData[index].masterData.current.metaTitle = cleanedTitle;
        updatedTableData[index].masterData.current.metaDescription =
          cleanedDescription;
        updatedTableData[index].version = responseFromAi.version;
        setTableData(updatedTableData);
      }
    }
  }, [responseFromAi]);

  const searchBoxText =
    'Search by Product key, Name, Seo title or Seo description';

  return (
    <GridContainer
      search={search}
      setSearch={setSearch}
      handleSearch={handleSearch}
      fetchData={fetchData}
      selectedRows={selectedRows}
      handleBulkGenerateClick={()=>handleSeoBulkGenerateClick(context,gridRef,selectedRows, dataLocale, setState, tableData, setTableData)}
      handleBulkApplyClick={()=>handleSeoBulkApplyClick(selectedRows, context, gridRef, dataLocale, setState,tableData, setTableData)}
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
    />
  );
};
export default TableContainer;
