import styles from './TableContainer.module.css';
import { SearchTextInput } from '@commercetools-frontend/ui-kit';
import { Pagination } from '@commercetools-uikit/pagination';
import Loader from '../Loader/Loader';
import SearchPerformed from './SearchPerformed';
import BulkUpdateButtonSection from './BulkUpdateButtonSection';
import { SetStateAction, useEffect, useMemo, FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import CustomLoadingOverlay from '../CustomLoadingOverlay/CustomLoadingOverlay';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import { IAppContext } from '../../context/AppContext';
import { IProduct } from './TableContainer.types';
import { TState } from '@commercetools-uikit/hooks';

interface GridContainerProps {
  search: string;
  setSearch: (value: string) => void;
  handleSearch: () => void;
  fetchData: () => void;
  selectedRows: IProduct[] | null;
  handleBulkGenerateClick: () => void;
  handleBulkApplyClick: () => void;
  gridRef: any;
  state: IAppContext;
  tableData: IProduct[];
  colDefs: any[];
  context: any;
  onSelectionChanged: () => void;
  totalProductCount?: number;
  page: TState;
  perPage: TState;
  searchPerformed: boolean;
  searchboxPlaceholder: string;
  components: any;
}

const GridContainer: FC<GridContainerProps> = ({
  search,
  setSearch,
  handleSearch,
  fetchData,
  selectedRows,
  handleBulkGenerateClick,
  handleBulkApplyClick,
  gridRef,
  state,
  tableData,
  colDefs,
  context,
  onSelectionChanged,
  totalProductCount,
  page,
  perPage,
  searchPerformed,
  searchboxPlaceholder,
  components
}) => {
  const gridStyle = useMemo(() => ({ width: '100%', height: '65vh' }), []);
  const offSet = (page?.value - 1) * perPage?.value;
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      tooltipComponent: CustomTooltip,
    };
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  useEffect(() => {
    if (search) {
      handleSearch();
    } else {
      fetchData();
    }
  }, [dataLocale, offSet, perPage?.value]);
  
  const getRowStyle = (params: any) => {
    if (params.data.isGenerating) {
      return { background: '#F1F0FF' };
    }
  };
  return (
    <div className={`${styles.tableContainer}`}>
      <div className={`${styles.tableSearchSection}`}>
        <div className={`${styles.searchBar}`}>
          <SearchTextInput
            placeholder={searchboxPlaceholder}
            value={search}
            onChange={(event: { target: { value: SetStateAction<string> } }) =>
              setSearch(String(event.target.value))
            }
            onSubmit={handleSearch}
            onReset={() => {
              setSearch('');
              fetchData();
            }}
          />
        </div>
        <BulkUpdateButtonSection
          selectedRows={selectedRows}
          handleGenerate={handleBulkGenerateClick}
          handleApply={handleBulkApplyClick}
          gridRef={gridRef}
        />
      </div>
      {!state.pageLoading && !!tableData?.length ? (
        <div
          className="ag-theme-quartz"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <div style={gridStyle}>
            <AgGridReact
              getRowStyle={getRowStyle}
              ref={gridRef}
              rowData={tableData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              components={components}
              rowSelection={'multiple'}
              suppressRowClickSelection={true}
              tooltipShowDelay={1000}
              tooltipInteraction={true}
              reactiveCustomComponents={true}
              onSelectionChanged={onSelectionChanged}
              loadingOverlayComponent={loadingOverlayComponent}
              context={context}
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

export default GridContainer;
