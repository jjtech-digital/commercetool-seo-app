import PrimaryButton from '@commercetools-uikit/primary-button';
import { featuresPattern, normalDescPattern } from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { generateProductMetaData, updateProductMeta } from '../../api/fetchersFunction/productMetaDataFetchers';

export default (props: any) => {
  const { setState } = useAppContext();

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context?.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const handleGenerateClick = async (params: any) => {
    props.context.loadingOverlayMessage = 'Generating product description and features';

    props.gridRef.current!.api.showLoadingOverlay();
    try {
      const aiResponse = await generateProductMetaData(params?.data?.id, dataLocale, setState);

      let metaData = aiResponse?.choices?.[0]?.message?.content;

      const featuresMatch = metaData?.match(featuresPattern);
      const keyFeatures = featuresMatch ? featuresMatch[1].trim() : null;

      const descriptionMatch = metaData?.match(normalDescPattern);
      const description = descriptionMatch ? descriptionMatch[1].trim() : null;

      props.setResponseFromAi({
        id: params.data.id,
        keyFeatures: keyFeatures,
        description: description,
        version: params.data.version
      });
    } catch (error) {
      console.error('Error generating product metadata:', error);
    } finally {
      props.gridRef.current!.api.hideOverlay();
      props.context.loadingOverlayMessage = 'Loading';
    }
  };

  const handleApplyClick = async (rowIndex: number) => {
    const updatedRowData = props?.gridRef?.current?.api?.getDisplayedRowAtIndex(rowIndex)?.data;
    if (updatedRowData?.masterData?.current) {

      const { description } = updatedRowData.masterData.current;
      console.log(updatedRowData?.masterData?.current?.masterVariant?.attributesRaw)
      const featureDataLocale = dataLocale || "en"
      const keyFeatures = updatedRowData.masterData.current.masterVariant.attributesRaw.find((item : any) => item.name === "features").value[0][featureDataLocale]
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
            setState,
          );

          props.setResponseFromAi((prev: any) => ({
            ...prev,
            version: res?.version,
          }));
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
    <>
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
    </>
  );
};

