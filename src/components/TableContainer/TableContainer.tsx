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
import PrimaryButton from '@commercetools-uikit/primary-button';
import { SearchTextInput } from '@commercetools-frontend/ui-kit';
import Text from '@commercetools-uikit/text';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import { useProducts } from '../../scripts/useProducts/useProducts';
import { SimpleTextEditor } from '../SimpleTextEditor/SimpleTextEditor';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { Pagination } from '@commercetools-uikit/pagination';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { GearIcon } from '@commercetools-uikit/icons';
import { Link, useRouteMatch } from 'react-router-dom';
import {
  IProduct,
  IResponseFromAi,
} from './TableContainer.types';
import styles from './TableContainer.module.css';

import { useAppContext } from '../../context/AppContext';
import Loader from '../Loader/Loader';
import ActionRenderer from '../Renderers/ActionRenderer';
import CustomLoadingOverlay from '../CustomLoadingOverlay/CustomLoadingOverlay';
import { useBulkProducts } from '../../scripts/useBulkProducts/useBulkProducts';
import { descriptionPattern, titlePattern } from '../../constants';
import { useSearch } from '../../scripts/useSearch/useSearch';

const TableContainer = () => {
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
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

  const gridRef = useRef<AgGridReact>(null);
  const gridStyle = useMemo(() => ({ width: '100%', height: '65vh' }), []);

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const { page, perPage } = usePaginationState();
  const { getAllProductsData } = useProducts();
  const { getBulkSeoMetaData, applyBulkProducts } = useBulkProducts();
  const fetchSearchResults = useSearch();

  const { state, setState } = useAppContext();
  const match = useRouteMatch();
  const offSet = (page?.value - 1) * perPage?.value;
  const [colDefs, setColDefs] = useState([
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
  ]);

  const components = useMemo(
    () => ({
      actionRenderer: ActionRenderer,
    }),
    []
  );
  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };
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
    var getSelectedRows = gridRef.current!.api.getSelectedRows();
    setSelectedRows(getSelectedRows);
  }, [offSet, perPage?.value]);

  const handleBulkGenerateClick = async () => {
    context.loadingOverlayMessage =
      'Generating SEO metadata for selected products. This may take some time';
    gridRef.current!.api.showLoadingOverlay();

    const bulkProductIds: any = selectedRows?.map((products) => products?.id);
    const aiBulkResponse = await getBulkSeoMetaData(
      bulkProductIds,
      dataLocale,
      setState
    );

    const updatedTableData = [...tableData];

    aiBulkResponse?.forEach((response) => {
      const message = response?.data?.choices?.[0]?.message?.content;
      const titleMatch = message?.match(titlePattern);
      const title = titleMatch ? titleMatch[2]?.trim() : null;

      const descriptionMatch = message?.match(descriptionPattern);
      const description = descriptionMatch ? descriptionMatch[2]?.trim() : null;
      const cleanedTitle = removeDoubleQuotes(title);
      const cleanedDescription = removeDoubleQuotes(description);

      const index = updatedTableData.findIndex(
        (item) => item.id === response?.data?.productId
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
      const bulkSelectedProductsData = selectedRows?.map((product) => ({
        productId: product.id,
        metaTitle: product.masterData.current.metaTitle,
        metaDescription: product.masterData.current.metaDescription,
        version: product.version,
      }));
      context.loadingOverlayMessage =
        'Applying SEO meta for selected products. This may take some time';
      gridRef.current!.api.showLoadingOverlay();

      const res: any = await applyBulkProducts(
        bulkSelectedProductsData,
        dataLocale,
        setState
      );
      if (res) {
        const updatedTableData = [...tableData];

        res.forEach((updatedProduct: any) => {
          const index = updatedTableData?.findIndex(
            (item) => item?.id === updatedProduct?.data?.id
          );
          if (index !== -1) {
            updatedTableData[index].version = updatedProduct?.data?.version;
          }
        });

        setTableData(updatedTableData);
      }

      gridRef.current!.api.hideOverlay();
      context.loadingOverlayMessage = 'Loading';
    }
  };
  const handleSearch = async () => {

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
      const data = await fetchSearchResults(
        search,
        Number(perPage?.value),
        Number(offSet),
        dataLocale,
        setState
      );
      const filteredData = data?.results?.map((product: any) => {
        const nameInCurrentLocale = product?.name?.[dataLocale];
        const metaTitleInCurrentLocale = product?.metaTitle?.[dataLocale];
        const metaDescriptionInCurrentLocale =
          product?.metaDescription?.[dataLocale];

        return {
          id: product.id,
          version: product.version,
          key: product.key,
          name: nameInCurrentLocale,
          seoTitle: metaTitleInCurrentLocale,
          seoDescription: metaDescriptionInCurrentLocale,
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
      setTotalProductCount(data.total);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };
  const fetchData = async () => {
    setSearchPerformed(false);
    try {
      const productsData = await getAllProductsData(
        Number(perPage?.value),
        Number(offSet),
        dataLocale,
        setState
      );
      setTotalProductCount(productsData?.total);
      setTableData(productsData.data);
    } catch (error) {
      console.log(error);
    }
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
      <Text.Headline as="h2">
        {'Generate SEO title and description'}
      </Text.Headline>
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
        <div className={`${styles.actionContainer}`}>
          {selectedRows && selectedRows.length > 0 && (
            <div className={`${styles.actionButons}`}>
              <PrimaryButton
                size="medium"
                label="Generate"
                onClick={handleBulkGenerateClick}
                isDisabled={false}
              />
              <PrimaryButton
                size="medium"
                label="Cancel"
                onClick={() => gridRef?.current!?.api?.stopEditing(true)}
                isDisabled={false}
              />
              <PrimaryButton
                size="medium"
                label="Apply"
                onClick={handleBulkApplyClick}
                isDisabled={false}
              />
            </div>
          )}
          <Link
            to={`${match.url}/settings`}
            className={`${styles.settingIcon}`}
          >
            <GearIcon size="scale" color="primary40" />
          </Link>
        </div>
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
              onGridReady={onGridReady as any}
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
        <div 
        className={`${styles.emptyState}`}>
          {state.pageLoading ? (
            <Loader shoudLoaderSpinnerShow={true} loadingMessage={'Loading...'} />
          ) : searchPerformed ? (
            <Text.Body>{"No products found matching your search criteria."}</Text.Body>
          ) : (
            <Text.Body>{"No products available."}</Text.Body>
          )}
        </div>
      )}
    </div>
  );
};
export default TableContainer;
