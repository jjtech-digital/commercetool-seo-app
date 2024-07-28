import styles from './Settings.module.css';
import IconButton from '@commercetools-uikit/icon-button';
import { PlusBoldIcon, CloseBoldIcon } from '@commercetools-uikit/icons';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';


export const SettingsRuleDataRender = ({ruleComponents, state} : any) => {
  return (
    <div>
    {ruleComponents?.map((component : any) => {
      const isApiFetching =
        component.heading === 'Seo Rules'
          ? state.isApiFetchingSEO
          : component.heading === 'Description Rules'
          ? state.isApiFetchingDescription
          : state.isApiFetchingKeyFeatures;
      return (
        <div key={component?.heading}>
          <span className={`${styles.ruleHeading}`}>
            {component?.heading}
          </span>
          <form
            onSubmit={component.handleSubmit(component?.onSubmitFunction)}
            className={`${styles.gridRuleDataSection}`}
          >
            {component.fields.map((item : any, index : number) => (
              <div key={item.id}>
                <div className={`${styles.gridRuleInputWrapper}`}>
                  <div className={`${styles.gridRuleInputContainer}`}>
                    <input
                      className={`${styles.gridRuleInputStyle}`}
                      {...component.register(
                        `rulesContent.${index}.rulesInput`,
                        {
                          required: 'Rules Content is required',
                        }
                      )}
                      placeholder="Generate good content"
                    />
                    {component?.errors?.rulesContent?.[index]?.rulesInput && (
                      <div style={{ color: 'red', marginTop: '4px' }}>
                        {
                          component.errors.rulesContent[index]?.rulesInput
                            ?.message
                        }
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
  )
}

export default SettingsRuleDataRender