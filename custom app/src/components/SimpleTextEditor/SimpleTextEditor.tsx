import { forwardRef, useEffect, useRef } from 'react';
import styles from './SimpleTextEditor.module.css';
import IconButton from '@commercetools-uikit/icon-button';
import { CheckBoldIcon, CloseBoldIcon } from '@commercetools-uikit/icons';
interface SimpleTextEditorProps {
  value: string;
  onValueChange: (value: string | null) => void;
  eventKey: string | null;
  initialValue: string;
  stopEditing: () => void;
}

export const SimpleTextEditor = forwardRef<
  HTMLInputElement,
  SimpleTextEditorProps
>((props, ref) => {
  const { value, onValueChange, eventKey } = props;
  const updateValue = (val: string) => {
    onValueChange?.(val === '' ? null : val);
  };

  useEffect(() => {
    let startValue;
    if (eventKey === 'Backspace') {
      startValue = '';
    } else if (eventKey && eventKey.length === 1) {
      startValue = eventKey;
    } else {
      startValue = value;
    }
    if (startValue == null) {
      startValue = '';
    }

    updateValue(startValue);

    refInput.current?.focus();
  }, []);

  const refInput = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={`${styles.mySimpleEditorContainer}`}>
      <textarea
        value={value || ''}
        ref={refInput}
        onChange={(e) => updateValue(e.target.value)}
        className={`${styles.mySimpleEditor}`}
      />
      <div className={`${styles.mySimpleEditorButtonContainer}`}>
        <IconButton
          icon={<CloseBoldIcon />}
          label="CloseBoldIcon"
          size="medium"
          onClick={() => {
            updateValue(props.initialValue);
            props.stopEditing();
          }}
        />
        <IconButton
          icon={<CheckBoldIcon />}
          label="CheckBoldIcon"
          size="medium"
          onClick={() => {
            updateValue(value);
            props.stopEditing();
          }}
        />
      </div>
    </div>
  );
});
