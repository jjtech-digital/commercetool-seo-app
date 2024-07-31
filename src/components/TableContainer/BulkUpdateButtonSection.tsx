import  styles from "./TableContainer.module.css"
import { PrimaryButton } from '@commercetools-frontend/ui-kit'

const BulkUpdateButtonSection = ({selectedRows, handleGenerate, handleApply, gridRef}) => {
  return (
    <div className={`${styles.actionContainer}`}>
    {selectedRows && selectedRows.length > 0 && (
      <div className={`${styles.actionButons}`}>
        <PrimaryButton
          size="medium"
          label="Generate"
          onClick={handleGenerate}
          isDisabled={false}
        />
        <PrimaryButton
          size="medium"
          label="Cancel"
          onClick={() => gridRef?.current?.api?.stopEditing(true)}
          isDisabled={false}
        />
        <PrimaryButton
          size="medium"
          label="Apply"
          onClick={handleApply}
          isDisabled={false}
        />
      </div>
    )}
  </div>
  )
}

export default BulkUpdateButtonSection