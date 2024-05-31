import { useEffect, useRef, useState } from 'react';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import IconButton from '@commercetools-uikit/icon-button';
import { PlusBoldIcon, CloseBoldIcon } from '@commercetools-uikit/icons';
import styles from './Settings.module.css';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { useSettings } from '../../scripts/useSettings/useSettings';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Loader from '../Loader/Loader';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const { createRuleshandler, getsavedRules } = useSettings();
  const { state, setState } = useAppContext();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rulesContent',
  });
  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current && fields.length === 0) {
      append({ rulesInput: '', deletable: false });
      isInitialized.current = true;
    } else {
      setCurrentIndex(fields.length - 1);
    }
  }, [fields, append]);


  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const fetchSavedRules = async () => {
      try {
        if (accessToken) {
          const response = await getsavedRules(accessToken, setState);

          if (response && Array.isArray(response.value)) {
            remove();
            response.value.forEach((value: any) => {
              append({ rulesInput: value, deletable: false });
            });
          }
        }
      } catch (error) {
        console.error('Error fetching saved rules:', error);
      }
    };
    fetchSavedRules();
  }, []);

  const handleAddField = () => {
    append({ rulesInput: '', deletable: false });

    setCurrentIndex(fields.length);
  };

  const handleRemoveField = (index: number) => {
    remove(index);
    setCurrentIndex(fields.length - 2);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    event?.preventDefault();
    const formData: FormData = data as FormData;
    try {
      const response = await createRuleshandler(formData, setState);
      setState((prev: any) => ({
        ...prev,
        notificationMessage: response?.message,
        notificationMessageType:"success"
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return !state.pageLoading ? (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${styles.gridRuleDataSection}`}
      >
        {fields.map((item, index) => (
          <div key={item.id}>
            <div className={`${styles.gridRuleInputWrapper}`}>
              <div className={`${styles.gridRuleInputContainer}`}>
                <input
                  className={`${styles.gridRuleInputStyle}`}
                  {...register(`rulesContent.${index}.rulesInput`, {
                    required: 'Rules Content is required',
                  })}
                  placeholder="Generate good content"
                />
                {errors?.rulesContent &&
                  errors?.rulesContent[index]?.rulesInput && (
                    <div style={{ color: 'red', marginTop: '4px' }}>
                      {errors.rulesContent[index]?.rulesInput?.message}
                    </div>
                  )}
              </div>

              {index === currentIndex ? (
                <IconButton
                  icon={<PlusBoldIcon />}
                  label="Add"
                  onClick={handleAddField}
                />
              ) : (
                <IconButton
                  icon={<CloseBoldIcon />}
                  label="Delete"
                  onClick={() => handleRemoveField(index)}
                />
              )}
            </div>
          </div>
        ))}
        <div className={`${styles.ruleFormSubmitButton}`}>
          {state?.isApiFetching ? (
            <SecondaryButton
              iconLeft={<LoadingSpinner />}
              label="Submitting"
              type="submit"
              isDisabled={true}
            />
          ) : (
            <PrimaryButton label="Submit" type="submit" />
          )}
        </div>
      </form>
    </div>
  ) : (
    <Loader shoudLoaderSpinnerShow={true} loadingMessage={'Loading...'} />
  );
};

export default SettingsRulesData;
