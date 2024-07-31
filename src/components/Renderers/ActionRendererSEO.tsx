import PrimaryButton from '@commercetools-uikit/primary-button';
import { useAppContext } from '../../context/AppContext';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  generateSeoMetaData,
  updateProductSeoMeta,
} from '../../api/fetchersFunction/seoMetaDataFetchers';
import { seoMatchData } from '../../api/fetchersFunction/utils';

export default (props: any) => {
  const { setState } = useAppContext();

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const handleGenerateClick = async (params: any) => {
    props.context.loadingOverlayMessage = 'Generating meta data';
    props.gridRef.current!.api.showLoadingOverlay();
    const aiResponse = await generateSeoMetaData(
      params?.data?.id,
      dataLocale,
      setState
    );
    const responseData = seoMatchData(aiResponse)
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
    <div style={{ display: 'flex' }}>
      <div>
        <PrimaryButton
          size="medium"
          label="Generate"
          onClick={() => handleGenerateClick(props)}
          isDisabled={false}
        />
      </div>
      <div style={{ marginInline: '6px' }}>
        <PrimaryButton
          size="medium"
          label="Apply"
          onClick={() => handleApplyClick(props.rowIndex)}
          isDisabled={false}
        />
      </div>
    </div>
  );
};
