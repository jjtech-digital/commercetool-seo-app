import { PrimaryButton } from "@commercetools-frontend/ui-kit"
import { FC } from "react"
import styles from "./../SettingsData/Settings.module.css"

interface ActionRenderButtonsProps {
  handleGenerate : (props :any) => void;
  handleApply: (rowIndex: number) => void;
  allProps: any;
}

const ActionRenderButtons: FC<ActionRenderButtonsProps>  = ({handleGenerate, handleApply, allProps}) => {
  return (
    <div className={styles.actionButtonsContainer}>
    <div>
      <PrimaryButton
        size="medium"
        label="Generate"
        onClick={() => handleGenerate(allProps)}
        isDisabled={false}
      />
    </div>
    <div className={styles.actionButtonWrapper}>
      <PrimaryButton
        size="medium"
        label="Apply"
        onClick={() => handleApply(allProps.rowIndex)}
        isDisabled={false}
      />
    </div>
  </div>
  )
}

export default ActionRenderButtons