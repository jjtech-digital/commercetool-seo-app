import styles from './customTooltip.module.css';
const CustomTooltip = (props: any) => {
  return (
    <div
      className={`${styles.customTooltip}`}
      style={{
        backgroundColor: props.color || '#f9f5f5',
      }}
    >
      {props.value}
    </div>
  );
};

export default CustomTooltip;
