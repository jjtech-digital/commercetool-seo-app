import { useAppContext } from '../../context/AppContext';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  queryOpenAi,
  updateProductSeoMeta,
} from '../../api/fetchersFunction/seoMetaDataFetchers';
import {
  generateMetaData,
  seoMatchData,
} from '../../api/fetchersFunction/utils';
import ActionRenderButtons from './ActionRenderButtons';

export default (props: any) => {
  const { setState } = useAppContext();
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
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const handleGenerateClick = async (params: any) => {
    props.context.loadingOverlayMessage = 'Generating meta data';
    props.gridRef.current!.api.showLoadingOverlay();
    params.data.isGenerating = true
    const aiResponse = await generateMetaData(
      secrets,
      params?.data?.id,
      dataLocale,
      queryOpenAi,
      setState
    );
    const responseData = seoMatchData(aiResponse);
    const { title, description } = responseData;
    props.setResponseFromAi({
      id: params.data.id,
      title: title,
      description: description,
      version: params.data.version,
    });
    props.gridRef.current!.api.hideOverlay();
    props.context.loadingOverlayMessage = 'Loading';
  };

  const handleApplyClick = async (rowIndex: number) => {
    props.gridRef.current.props.rowData[rowIndex].isGenerating =false
    const updatedRowData =
      props?.gridRef?.current!?.api?.getDisplayedRowAtIndex(rowIndex)?.data;

    if (updatedRowData?.masterData?.current) {
      const { metaTitle, metaDescription } = updatedRowData.masterData.current;

      if (!metaTitle && !metaDescription) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: 'SEO title and SEO description cannot be empty.',
          notificationMessageType: 'error',
        }));
      } else if (!metaTitle) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: 'SEO title cannot be empty.',
          notificationMessageType: 'error',
        }));
      } else if (!metaDescription) {
        setState((prev: any) => ({
          ...prev,
          notificationMessage: 'SEO description cannot be empty.',
          notificationMessageType: 'error',
        }));
      } else {
        props.context.loadingOverlayMessage = 'Applying';
        props.gridRef.current!.api.showLoadingOverlay();
        const res = await updateProductSeoMeta(
          secrets,
          updatedRowData.id,
          metaTitle,
          metaDescription,
          updatedRowData.version,
          dataLocale,
          setState
        );

        props.setResponseFromAi((prev: any) => ({
          ...prev,
          version: res?.version,
        }));
        props.gridRef.current!.api.hideOverlay();
        props.context.loadingOverlayMessage = 'Loading';
      }
    }
    props.gridRef?.current!?.api?.stopEditing(false);
  };

  return (
    <ActionRenderButtons
      handleGenerate={handleGenerateClick}
      handleApply={handleApplyClick}
      allProps={props}
    />
  );
};
