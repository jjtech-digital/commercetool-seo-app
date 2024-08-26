import styles from './Settings.module.css';
import IconButton from '@commercetools-uikit/icon-button';
import { PlusBoldIcon, CloseBoldIcon } from '@commercetools-uikit/icons';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import {
  RuleFormProps,
  RuleInputFieldProps,
  SettingRuleProps,
} from './Settings.types';

const RuleInputField = ({ item, index, component }: RuleInputFieldProps) => {
  return (
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
        <IconButton
          icon={<CloseBoldIcon />}
          label="Delete"
          onClick={() => component.handleRemoveField(index)}
        />
      </div>
    </div>
  );
};

const RuleForm = ({ component, isApiFetching }: RuleFormProps) => {
  return (
    <form
      onSubmit={component.handleSubmit(component?.onSubmitFunction)}
      className={`${styles.gridRuleDataSection}`}
    >
      {component.fields.map((item: any, index: number) => (
        <RuleInputField
          key={item.id}
          item={item}
          index={index}
          component={component}
        />
      ))}
      <div className={`${styles.ruleFormButtonContainer}`}>
        <IconButton
          icon={<PlusBoldIcon />}
          label="Add"
          onClick={component.handleAddField}
        />
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
      </div>
    </form>
  );
};

export const SettingsRuleDataRender = ({
  ruleComponents,
  state,
}: SettingRuleProps) => {
  return (
    <div>
      {ruleComponents?.map((component) => {
        const isApiFetching = (() => {
          switch (component.heading) {
            case 'Seo Rules':
              return state.isApiFetchingSEO;
            case 'Description Rules':
              return state.isApiFetchingDescription;
            default:
              return state.isApiFetchingKeyFeatures;
          }
        })();
        return (
          <div key={component?.heading}>
            <span className={`${styles.ruleHeading}`}>
              {component?.heading}
            </span>
            <RuleForm component={component} isApiFetching={isApiFetching} />
          </div>
        );
      })}
    </div>
  );
};

export default SettingsRuleDataRender;
