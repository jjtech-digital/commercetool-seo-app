import  styles from "./TableContainer.module.css"
import { PrimaryButton } from '@commercetools-frontend/ui-kit'
import { IProduct } from "./TableContainer.types";
import { RefObject } from "react";
import { AgGridReact } from "ag-grid-react";

interface BulkUpdateButtonSectionProps {
selectedRows: IProduct[] | null;
  handleGenerate: () => void;
  handleApply: () => void;
  gridRef: RefObject<AgGridReact<any>>;
}
const BulkUpdateButtonSection = ({selectedRows, handleGenerate, handleApply, gridRef} : BulkUpdateButtonSectionProps) => {
  return (
    <div className={`${styles.actionContainer}`}>
    {(selectedRows!==null) && selectedRows?.length > 0 && (
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