import {
  SetStateAction,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { SearchTextInput } from '@commercetools-frontend/ui-kit';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import { SimpleTextEditor } from '../SimpleTextEditor/SimpleTextEditor';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { Pagination } from '@commercetools-uikit/pagination';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { IProduct, IResponseFromAi } from './TableContainer.types';
import styles from './TableContainer.module.css';
import { useAppContext } from '../../context/AppContext';
import Loader from '../Loader/Loader';
import ActionRendererSEO from '../Renderers/ActionRendererSEO';
import CustomLoadingOverlay from '../CustomLoadingOverlay/CustomLoadingOverlay';
import { descriptionPattern, titlePattern } from '../../constants';
import apiRoot from '../../api/apiRoot';
import {
  applyBulkProductSeoMeta,
  bulkGenerateSeoMetaData,
} from '../../api/fetchersFunction/bulkSeoMetaDataFetchers';
import { commonColumns, fetchProductData, performSearch } from './utils';
import SearchPerformed from './SearchPerformed';
import BulkUpdateButtonSection from './BulkUpdateButtonSection';

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
  const gridStyle = useMemo(() => ({ width: '100%', height: '65vh' }), []);

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const { page, perPage } = usePaginationState();
  const { state, setState } = useAppContext();
  const offSet = (page?.value - 1) * perPage?.value;
  let defaultColumns = [
    ...commonColumns,
    {
      field: 'seoTitle',
      headerName: 'SEO Title',
      flex: 4,
      tooltipValueGetter: (p: { value: any }) => p.value,
      valueGetter: (params: any) => {
        return params?.data?.masterData?.current?.metaTitle;
      },
      valueSetter: (params: any) => {
        params.data.masterData.current.metaTitle = params.newValue;
        return true;
      },
      editable: true,
      sortable: false,
      cellEditor: SimpleTextEditor,
      cellEditorPopup: true,
    },
    {
      field: 'seoDescription',
      headerName: 'SEO Description',
      flex: 4,
      tooltipValueGetter: (p: { value: any }) => p.value,
      valueGetter: (params: any) => {
        return params.data?.masterData?.current?.metaDescription;
      },
      valueSetter: (params: any) => {
        params.data.masterData.current.metaDescription = params.newValue;
        return true;
      },
      editable: true,
      sortable: false,
      cellEditor: SimpleTextEditor,
      cellEditorPopup: true,
    },
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
  const colDefs = defaultColumns

  const components = useMemo(
    () => ({
      actionRenderer: ActionRendererSEO,
    }),
    []
  );

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      // editable: true,
      tooltipComponent: CustomTooltip,
    };
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const context = useMemo<any>(() => {
    return {
      loadingOverlayMessage: 'Loading',
    };
  }, []);
  const removeDoubleQuotes = (text: string) => {
    if (text?.startsWith('"') && text?.endsWith('"')) {
      return text?.slice(1, -1);
    }
    return text;
  };

  const onSelectionChanged = useCallback(() => {
    let getSelectedRows = gridRef.current!.api.getSelectedRows();
    setSelectedRows(getSelectedRows);
  }, [offSet, perPage?.value]);

  const handleBulkGenerateClick = async () => {
    context.loadingOverlayMessage =
      'Generating SEO metadata for selected products. This may take some time';
    gridRef.current!.api.showLoadingOverlay();

    const bulkProductIds: any = selectedRows?.map((products) => products?.id);
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
  const handleBulkApplyClick = async () => {
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
      const bulkSelectedProductsData: any = selectedRows?.map((product) => ({
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
        const nameInCurrentLocale = product.name?.[dataLocale || 
        "en"];
        const metaTitleInCurrentLocale = product.metaTitle?.[dataLocale || "en"];
        const metaDescriptionInCurrentLocale =
          product.metaDescription?.[dataLocale || "en"];
  
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
    if (search) {
      handleSearch();
    } else {
      fetchData();
    }
  }, [dataLocale, offSet, perPage?.value]);

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

  return (
    <div className={`${styles.tableContainer}`}>
      <div className={`${styles.tableSearchSection}`}>
        <div className={`${styles.searchBar}`}>
          <SearchTextInput
            placeholder="Search by Product key, Name, Seo title or Seo description "
            value={search}
            onChange={(event: { target: { value: SetStateAction<string> } }) =>
              setSearch(event.target.value)
            }
            onSubmit={handleSearch}
            onReset={() => {
              setSearch('');
              fetchData();
            }}
            // isClearable={false}
          />
        </div>
         <BulkUpdateButtonSection selectedRows={selectedRows} handleGenerate={handleBulkGenerateClick} handleApply={handleBulkApplyClick} gridRef={gridRef} />
      </div>
      {!state.pageLoading && !!tableData?.length ? (
        <div
          className="ag-theme-quartz"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              // getRowId={getRowId}
              rowData={tableData as any}
              columnDefs={colDefs as any}
              defaultColDef={defaultColDef}
              // onGridReady={onGridReady as any}
              components={components}
              rowSelection={'multiple'}
              suppressRowClickSelection={true}
              tooltipShowDelay={1000}
              tooltipInteraction={true}
              reactiveCustomComponents={true}
              onSelectionChanged={onSelectionChanged}
              loadingOverlayComponent={loadingOverlayComponent}
              context={context}
              // onCellDoubleClick={onCellDoubleClick}
              //  suppressClickEdit={true}
              // editType="fullRow"
            />
          </div>
          <Pagination
            totalItems={totalProductCount || 0}
            page={page?.value}
            onPageChange={page?.onChange}
            perPage={perPage?.value}
            onPerPageChange={perPage?.onChange}
            perPageRange={'m'}
          />
        </div>
      ) : (
        <div className={`${styles.emptyState}`}>
          {state.pageLoading ? (
            <Loader
              shoudLoaderSpinnerShow={true}
              loadingMessage={'Loading...'}
            />
          ) : (
            <SearchPerformed searchPerformed={searchPerformed} />
          )}
        </div>
      )}
    </div>
  );
};
export default TableContainer;
