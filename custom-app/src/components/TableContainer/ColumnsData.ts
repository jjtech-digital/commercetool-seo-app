import { SimpleTextEditor } from '../SimpleTextEditor/SimpleTextEditor';
import { commonColumns } from './utils';


export const defaultDescColumns = [
  ...commonColumns,
  {
    field: 'Description',
    headerName: 'Description',
    flex: 4,
    tooltipValueGetter: (p: { value: any }) => {
      return p.value;
    },
    valueGetter: (params: any) => {
      return params.data?.masterData?.current?.description;
    },
    valueSetter: (params: any) => {
      params.data.masterData.current.description = params.newValue;
      return true;
    },
    editable: true,
    sortable: false,
    cellEditor: SimpleTextEditor,
    cellEditorPopup: true,
  },
  {
    field: 'Key Features',
    headerName: 'Key Features',
    flex: 4,
    tooltipValueGetter: (p: { value: any }) => {
      return p.value;
    },
    valueGetter: (params: any) => {
      const LS_DataLocale = localStorage.getItem('selectedDataLocale') || 'en';
      const features =
        params.data.masterData.current.masterVariant.attributesRaw.find(
          (item: any) => item.name === 'features'
        )?.value;
      const groupedResult: { [key: string]: string[] } = {};
      let transformedArray = [];
      if (features) {
        for (let item of features) {
          for (let key in item) {
            if (groupedResult[key]) {
              groupedResult[key].push(item[key]);
            } else {
              groupedResult[key] = [item[key]];
            }
          }
        }
        for (const key in groupedResult) {
          transformedArray.push({ [key]: groupedResult[key].join(', ') });
        }

        return transformedArray?.[0]?.[LS_DataLocale];
      }
      return [];
    },
    valueSetter: (params: any) => {
      const LS_DataLocale = localStorage.getItem('selectedDataLocale');
      const attributesRaw =
        params.data.masterData.current.masterVariant.attributesRaw;
      let features = attributesRaw.find(
        (item: any) => item.name === 'features'
      );
      if (!features) {
        features = {
          name: 'features',
          value: [{ [LS_DataLocale]: params.newValue }],
        };
        attributesRaw.push(features);
        return true;
      }
      if (features) {
        features = {
          name: 'features',
          value: [{ [LS_DataLocale]: params.newValue }],
        };
        return true;
      }
      return false;
    },
    editable: true,
    sortable: false,
    cellEditor: SimpleTextEditor,
    cellEditorPopup: true,
  },
];

export const defaultSeoColumns = [
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
];
