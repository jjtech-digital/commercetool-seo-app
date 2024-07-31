import { SimpleTextEditor } from "../SimpleTextEditor/SimpleTextEditor";
import { commonColumns } from "./utils";

const LS_DataLocale =
localStorage.getItem('selectedDataLocale') || 'en';

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
        const features =
          params.data.masterData.current.masterVariant.attributesRaw.find(
            (item: any) => item.name === 'features'
          )?.value?.[0];
        return features?.[LS_DataLocale];
      },
      valueSetter: (params: any) => {
        const features =
          params.data.masterData.current.masterVariant.attributesRaw.find(
            (item: any) => item.name === 'features'
          )?.value?.[0];
        if (features && LS_DataLocale) {
          features[LS_DataLocale] = params.newValue;
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