import { CustomLoadingOverlayProps } from 'ag-grid-react';
import styles from './CustomLoadingOverlay.module.css';

const CustomLoadingOverlay = (props: CustomLoadingOverlayProps) => {
  return (
    <div className="ag-overlay-loading-center">
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`${styles.loadingOverlay}`}
      >
        {props?.context?.loadingOverlayMessage}
        {''}
        <span className={`${styles.loadingDots}`}>...</span>
      </div>
    </div>
  );
};
export default CustomLoadingOverlay;
