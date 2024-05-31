import styles from './Settings.module.css';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useAiKey } from '../../scripts/useAiKey/useAiKey';
import { useAppContext } from '../../context/AppContext';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Loader from '../Loader/Loader';
const SettingsOpenAiData = () => {
  const { saveAiKeyHandler, getSavedAiKeyHandler } = useAiKey();
  const { state, setState } = useAppContext();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    event?.preventDefault();

    try {
      const response = await saveAiKeyHandler(data.openAi, setState);
      localStorage.setItem('openAIKey', response.data.value);
      setState((prev: any) => ({
        ...prev,
        notificationMessage: response?.message,
        notificationMessageType: 'success',
      }));
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        notificationMessage: 'Failed to save key',
        notificationMessageType: 'error',
      }));
    }
  };
  const fetchKey = async () => {
    try {
      const response = await getSavedAiKeyHandler(setState);
      if (response.value) {
        localStorage.setItem('openAIKey', response.value);
        setValue('openAi', response.value);
      }
    } catch (error) {
      console.error('Error fetching key:', error);
    }
  };

  useEffect(() => {
    fetchKey();
  }, []);

  return !state.pageLoading ? (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${styles.gridRuleDataSection}`}
      >
        <div className={`${styles.gridRuleInputWrapper}`}>
          <div className={`${styles.gridRuleInputContainer}`}>
            <input
              className={`${styles.gridRuleInputStyle}`}
              {...register(`openAi`, {
                required: 'This field is required is required',
              })}
              placeholder="Enter OpenAI key"
            />
            {errors && errors?.openAi && (
              <div style={{ color: 'red', marginTop: '4px' }}>
                {errors.openAi.message}
              </div>
            )}
          </div>
        </div>
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

export default SettingsOpenAiData;
