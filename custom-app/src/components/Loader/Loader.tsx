import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styles from './Loader.module.css';

export interface ILoaderProps {
  loadingMessage?: string;
  shoudLoaderSpinnerShow?: boolean;
}

const Loader = ({
  shoudLoaderSpinnerShow = true,
  loadingMessage,
}: ILoaderProps) => {
  return (
    <div className={`${styles.loaderContainer}`}>
      {shoudLoaderSpinnerShow && <LoadingSpinner />}
      {loadingMessage && <p>{loadingMessage}</p>}
    </div>
  );
};

export default Loader;
