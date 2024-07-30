import { ContentNotification } from '@commercetools-uikit/notifications';
import styles from './Notification.module.css';
import { useEffect } from 'react';

interface INotificationProps {
  successMessage: string;
  setSuccessMessage: Function;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const Notification = ({
  successMessage,
  setSuccessMessage,
  type = 'success',
}: INotificationProps) => {
  const handleNotificationDismiss = () => {
    setSuccessMessage((prev: any) => ({
      ...prev,
      notificationMessage: '',
      notificationMessageType: '',
    }));
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        handleNotificationDismiss();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  return (
    <div className={`${styles.notificationBottom}`}>
      <ContentNotification type={type} onRemove={handleNotificationDismiss}>
        {successMessage}
      </ContentNotification>
    </div>
  );
};

export default Notification;
