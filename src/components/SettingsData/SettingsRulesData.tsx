import { useEffect, useRef, useState } from 'react';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import IconButton from '@commercetools-uikit/icon-button';
import { PlusBoldIcon, CloseBoldIcon } from '@commercetools-uikit/icons';
import styles from './settings.module.css';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Loader from '../loader/loader';
import {
  LS_KEY,
  CTP_CUSTOM_OBJ_SEO_CONTAINER_NAME,
  CTP_CUSTOM_OBJ_SEO_CONTAINER_KEY,
  CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_NAME,
  CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_KEY,
  CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_NAME,
  CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_KEY,
} from '../../constants';
import {
  createRulesInCtCustomObj,
  getAllSavedRulesFromCtObj,
} from '../../api/fetchersFunction/ruleFetchers';
export interface RuleContentItem {
  rulesInput: string;
  deletable: boolean;
}
export interface FormData {
  rulesContent: RuleContentItem[];
}
export interface SubmitEvent {
  preventDefault: () => void;
}
const SettingsRulesData = () => {
  const [currentIndex, setCurrentIndex] = useState({ seo: 0, description: 0, keyFeatures: 0 });
  const { state, setState } = useAppContext();

  const {
    control: controlSEO,
    register: registerSEO,
    handleSubmit: handleSubmitSEO,
    formState: { errors: errorsSEO },
    reset: resetSEO,
  } = useForm();

  const {
    control: controlDescription,
    register: registerDescription,
    handleSubmit: handleSubmitDescription,
    formState: { errors: errorsDescription },
    reset: resetDescription,
  } = useForm();

  const {
    control: controlKeyFeatures,
    register: registerKeyFeatures,
    handleSubmit: handleSubmitKeyFeatures,
    formState: { errors: errorsKeyFeatures },
    reset: resetKeyFeatures,
  } = useForm();

  const { fields: fieldsSEO, append: appendSEO, remove: removeSEO } = useFieldArray({
    control: controlSEO,
    name: 'rulesContent',
  });

  const { fields: fieldsDescription, append: appendDescription, remove: removeDescription } = useFieldArray({
    control: controlDescription,
    name: 'rulesContent',
  });

  const { fields: fieldsKeyFeatures, append: appendKeyFeatures, remove: removeKeyFeatures } = useFieldArray({
    control: controlKeyFeatures,
    name: 'rulesContent',
  });

  const isInitialized = useRef({ seo: false, description: false, keyFeatures: false });

  useEffect(() => {
    if (!isInitialized.current.seo && fieldsSEO.length === 0) {
      appendSEO({ rulesInput: '', deletable: false });
      isInitialized.current.seo = true;
    } else {
      setCurrentIndex((prev) => ({ ...prev, seo: fieldsSEO.length - 1 }));
    }
  }, [fieldsSEO, appendSEO]);

  useEffect(() => {
    if (!isInitialized.current.description && fieldsDescription.length === 0) {
      appendDescription({ rulesInput: '', deletable: false });
      isInitialized.current.description = true;
    } else {
      setCurrentIndex((prev) => ({ ...prev, description: fieldsDescription.length - 1 }));
    }
  }, [fieldsDescription, appendDescription]);

  useEffect(() => {
    if (!isInitialized.current.keyFeatures && fieldsKeyFeatures.length === 0) {
      appendKeyFeatures({ rulesInput: '', deletable: false });
      isInitialized.current.keyFeatures = true;
    } else {
      setCurrentIndex((prev) => ({ ...prev, keyFeatures: fieldsKeyFeatures.length - 1 }));
    }
  }, [fieldsKeyFeatures, appendKeyFeatures]);

  useEffect(() => {
    const accessToken = localStorage.getItem(LS_KEY.CT_OBJ_TOKEN);
    const fetchSavedSEORules = async () => {
      try {
        if (accessToken) {
          const response = await getAllSavedRulesFromCtObj(
            accessToken,
            CTP_CUSTOM_OBJ_SEO_CONTAINER_NAME,
            CTP_CUSTOM_OBJ_SEO_CONTAINER_KEY,
            setState
          );
          if (response && Array.isArray(response.value)) {
            removeSEO();
            response.value.forEach((value: any) => {
              appendSEO({ rulesInput: value, deletable: false });
            });
          }
        }
      } catch (error) {
        console.error('Error fetching saved rules:', error);
      }
    };
    fetchSavedSEORules();
    const fetchSavedDescriptionRules = async () => {
      try {
        if (accessToken) {
          const response = await getAllSavedRulesFromCtObj(
            accessToken,
            CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_NAME,
            CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_KEY,
            setState
          );
          if (response && Array.isArray(response.value)) {
            removeDescription();
            response.value.forEach((value: any) => {
              appendDescription({ rulesInput: value, deletable: false });
            });
          }
        }
      } catch (error) {
        console.error('Error fetching saved rules:', error);
      }
    };
    fetchSavedDescriptionRules();
    const fetchSavedKeyFeatureRules = async () => {
      try {
        if (accessToken) {
          const response = await getAllSavedRulesFromCtObj(
            accessToken,
            CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_NAME,
            CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_KEY,
            setState
          );
          if (response && Array.isArray(response.value)) {
            removeKeyFeatures();
            response.value.forEach((value: any) => {
              appendKeyFeatures({ rulesInput: value, deletable: false });
            });
          }
        }
      } catch (error) {
        console.error('Error fetching saved rules:', error);
      }
    };
    fetchSavedKeyFeatureRules();
  }, []);

  const handleAddField = (type : string) => {
    if (type === 'seo') {
      appendSEO({ rulesInput: '', deletable: false });
      setCurrentIndex((prev) => ({ ...prev, seo: fieldsSEO.length }));
    } else if (type === 'description') {
      appendDescription({ rulesInput: '', deletable: false });
      setCurrentIndex((prev) => ({ ...prev, description: fieldsDescription.length }));
    } else if (type === 'keyFeatures') {
      appendKeyFeatures({ rulesInput: '', deletable: false });
      setCurrentIndex((prev) => ({ ...prev, keyFeatures: fieldsKeyFeatures.length }));
    }
  };

  const handleRemoveField = (type : string, index : number) => {
    if (type === 'seo') {
      removeSEO(index);
      setCurrentIndex((prev) => ({ ...prev, seo: fieldsSEO.length - 2 }));
    } else if (type === 'description') {
      removeDescription(index);
      setCurrentIndex((prev) => ({ ...prev, description: fieldsDescription.length - 2 }));
    } else if (type === 'keyFeatures') {
      removeKeyFeatures(index);
      setCurrentIndex((prev) => ({ ...prev, keyFeatures: fieldsKeyFeatures.length - 2 }));
    }
  };

  const onSubmitSEO: SubmitHandler<FieldValues> = async (data, event) => {
    event?.preventDefault();
    setState((prev: any) => ({ ...prev, isApiFetchingSEO: true }));
    const formData: FormData = data as FormData;
    try {
      const response = await createRulesInCtCustomObj(
        formData,
        setState,
        CTP_CUSTOM_OBJ_SEO_CONTAINER_NAME,
        CTP_CUSTOM_OBJ_SEO_CONTAINER_KEY
      );
      setState((prev: any) => ({
        ...prev,
        notificationMessage: response?.message,
        notificationMessageType: 'success',
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev: any) => ({ ...prev, isApiFetchingSEO: false }));
    }
  };
  
  const onSubmitDescription: SubmitHandler<FieldValues> = async (
    data,
    event
  ) => {
    event?.preventDefault();
    setState((prev: any) => ({ ...prev, isApiFetchingDescription: true }));
    const formData: FormData = data as FormData;
    try {
      const response = await createRulesInCtCustomObj(
        formData,
        setState,
        CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_NAME,
        CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_KEY
      );
      setState((prev: any) => ({
        ...prev,
        notificationMessage: response?.message,
        notificationMessageType: 'success',
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev: any) => ({ ...prev, isApiFetchingDescription: false }));
    }
  };
  
  const onSubmitKeyFeatures: SubmitHandler<FieldValues> = async (
    data,
    event
  ) => {
    event?.preventDefault();
    setState((prev: any) => ({ ...prev, isApiFetchingKeyFeatures: true }));
    const formData: FormData = data as FormData;
    try {
      const response = await createRulesInCtCustomObj(
        formData,
        setState,
        CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_NAME,
        CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_KEY
      );
      setState((prev: any) => ({
        ...prev,
        notificationMessage: response?.message,
        notificationMessageType: 'success',
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev: any) => ({ ...prev, isApiFetchingKeyFeatures: false }));
    }
  };
  

  const ruleComponents = [
    {
      heading: 'Seo Rules',
      onSubmitFunction: onSubmitSEO,
      fields: fieldsSEO,
      register: registerSEO,
      errors: errorsSEO,
      handleAddField: () => handleAddField('seo'),
      handleRemoveField: (index : number) => handleRemoveField('seo', index),
      currentIndex: currentIndex.seo,
      handleSubmit: handleSubmitSEO,
    },
    {
      heading: 'Description Rules',
      onSubmitFunction: onSubmitDescription,
      fields: fieldsDescription,
      register: registerDescription,
      errors: errorsDescription,
      handleAddField: () => handleAddField('description'),
      handleRemoveField: (index : number) => handleRemoveField('description', index),
      currentIndex: currentIndex.description,
      handleSubmit: handleSubmitDescription,
    },
    {
      heading: 'Key Feature Rules',
      onSubmitFunction: onSubmitKeyFeatures,
      fields: fieldsKeyFeatures,
      register: registerKeyFeatures,
      errors: errorsKeyFeatures,
      handleAddField: () => handleAddField('keyFeatures'),
      handleRemoveField: (index : number) => handleRemoveField('keyFeatures', index),
      currentIndex: currentIndex.keyFeatures,
      handleSubmit: handleSubmitKeyFeatures,
    },
  ];
  
  return !state.pageLoading ? (
    <div>
      {ruleComponents?.map((component) => {
         const isApiFetching = 
         component.heading === 'Seo Rules' ? state.isApiFetchingSEO :
         component.heading === 'Description Rules' ? state.isApiFetchingDescription :
         state.isApiFetchingKeyFeatures;
        return (
          <div key={component?.heading}>
            <span className={`${styles.ruleHeading}`}>
              {component?.heading}
            </span>
            <form
              onSubmit={component.handleSubmit(component?.onSubmitFunction)}
              className={`${styles.gridRuleDataSection}`}
            >
              {component.fields.map((item, index) => (
                <div key={item.id}>
                  <div className={`${styles.gridRuleInputWrapper}`}>
                    <div className={`${styles.gridRuleInputContainer}`}>
                      <input
                        className={`${styles.gridRuleInputStyle}`}
                        {...component.register(`rulesContent.${index}.rulesInput`, {
                          required: 'Rules Content is required',
                        })}
                        placeholder="Generate good content"
                      />
                      {component?.errors?.rulesContent?.[index]?.rulesInput && (
                          <div style={{ color: 'red', marginTop: '4px' }}>
                            {component.errors.rulesContent[index]?.rulesInput?.message}
                          </div>
                        )}
                    </div>
  
                    {index === component.currentIndex ? (
                      <IconButton
                        icon={<PlusBoldIcon />}
                        label="Add"
                        onClick={component.handleAddField}
                      />
                    ) : (
                      <IconButton
                        icon={<CloseBoldIcon />}
                        label="Delete"
                        onClick={() => component.handleRemoveField(index)}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className={`${styles.ruleFormSubmitButton}`}>
                {isApiFetching ? (
                  <SecondaryButton
                    iconLeft={<LoadingSpinner />}
                    label="Submitting"
                    type="submit"
                    isDisabled={true}
                  />
                ) : (
                  <PrimaryButton label="Save" type="submit" />
                )}
              </div>
            </form>
          </div>
        );
      })}
    </div>
  ) : (
    <Loader shoudLoaderSpinnerShow={true} loadingMessage={'Loading...'} />
  );
  
};

export default SettingsRulesData;
