import { useAppContext } from '../../context/AppContext';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  queryProductOpenAi,
  updateProductMeta,
} from '../../api/fetchersFunction/productMetaDataFetchers';
import { generateMetaData, matchData } from '../../api/fetchersFunction/utils';
import ActionRenderButtons from './ActionRenderButtons';

export default (props: any) => {
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
  const { setState } = useAppContext();

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context?.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const handleGenerateClick = async (params: any) => {
    props.context.loadingOverlayMessage =
      'Generating product description and features';

    props.gridRef.current!.api.showLoadingOverlay();
    params.data.isGenerating = true
    try {
      const aiResponse = await generateMetaData(
        secrets,
        params?.data?.id,
        dataLocale,
        queryProductOpenAi,
        setState
      );

      const matchDataResponse = matchData(aiResponse);
      const { keyFeatures, description } = matchDataResponse;

      props.setResponseFromAi({
        id: params.data.id,
        keyFeatures: keyFeatures,
        description: description,
        version: params.data.version,
      });
    } catch (error) {
      console.error('Error generating product metadata:', error);
    } finally {
      props.gridRef.current!.api.hideOverlay();
      props.context.loadingOverlayMessage = 'Loading';
    }
  };

  const handleApplyClick = async (rowIndex: number) => {
    props.gridRef.current.props.rowData[rowIndex].isGenerating =false
    const rowNode = props?.gridRef?.current?.api?.getDisplayedRowAtIndex(rowIndex);
    const updatedRowData = rowNode?.data;
    if (updatedRowData?.masterData?.current) {
      const { description } = updatedRowData.masterData.current;
      const featureDataLocale = dataLocale || 'en';
      const feats =
        updatedRowData.masterData.current.masterVariant.attributesRaw.find(
          (item: any) => item.name === 'features'
        )
        const keyFeatures = feats?.value ? feats.value?.[0]?.[featureDataLocale] : "";
      if (!description && !keyFeatures) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: 'Description and Key Features cannot be empty.',
          notificationMessageType: 'error',
        }));
        
      } else if (!description) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: 'Description cannot be empty.',
          notificationMessageType: 'error',
        }));
      }
      // Can be uncommented if we want make key features compulsory
      // else if (!keyFeatures) {
      //   setState((prev: any) => ({
      //     ...prev,
      //     notificationMessage: 'Key Features cannot be empty.',
      //     notificationMessageType: 'error',
      //   }));
      // }
      else {
        props.context.loadingOverlayMessage = 'Applying';
        props.gridRef.current!.api.showLoadingOverlay();
        try {
          const res = await updateProductMeta(
            updatedRowData.id,
            keyFeatures,
            description,
            updatedRowData.version,
            dataLocale,
            secrets,
            setState
          );

          props.setResponseFromAi((prev: any) => ({
            ...prev,
            version: res?.version,
          }));
          props.gridRef.current.props.rowData[rowIndex].isGenerating =false
        } catch (error) {
          console.error('Error updating product metadata:', error);
        } finally {
          props.gridRef.current!.api.hideOverlay();
          props.context.loadingOverlayMessage = 'Loading';
        }
      }
    }
    props.gridRef?.current?.api?.stopEditing(false);
  };

  return (
    <ActionRenderButtons
      handleGenerate={handleGenerateClick}
      handleApply={handleApplyClick}
      allProps={props}
    />
  );
};
