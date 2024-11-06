import styles from './Settings.module.css';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useAppContext } from '../../context/AppContext';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Loader from '../Loader/Loader';
import { LS_KEY } from '../../constants';
import {
  getSavedAiKeyFromCtCustomObj,
  saveAiKeyInCtCustomObj,
} from '../../api/fetchersFunction/aiKeyFetchers';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
const SettingsOpenAiData = () => {
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
      const response = await saveAiKeyInCtCustomObj(
        data.openAi,
        setState,
        secrets
      );
      localStorage.setItem(LS_KEY.OPEN_AI_KEY, response?.value);

      setState((prev: any) => ({
        ...prev,
        notificationMessage: response?.message || 'Key saved successfully.',
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
      const response = await getSavedAiKeyFromCtCustomObj(setState, secrets);
      if (response.value) {
        localStorage.setItem(LS_KEY.OPEN_AI_KEY, response.value);
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
                required: 'This field is required',
              })}
              placeholder="Enter OpenAI key"
            />
            {errors?.openAi && (
              <div style={{ color: 'red', marginTop: '4px' }}>
                {errors.openAi.message}
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.ruleFormSubmitButton}`}>
          {state?.isApiFetchingSEO ? (
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
