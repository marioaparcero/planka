import dequal from 'dequal';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextareaAutosize from 'react-textarea-autosize';
import { Button, Form, TextArea } from 'semantic-ui-react';

import { useClosableForm, useForm } from '../../../hooks';

import styles from './EditComment.module.scss';

const EditComment = React.forwardRef(({ children, defaultData, onUpdate }, ref) => {
  const [t] = useTranslation();
  const [isOpened, setIsOpened] = useState(false);
  const [data, handleFieldChange, setData] = useForm(null);

  const textField = useRef(null);

  const open = useCallback(() => {
    setIsOpened(true);
    setData({
      text: '',
      ...defaultData,
    });
  }, [defaultData, setData]);

  const close = useCallback(() => {
    setIsOpened(false);
    setData(null);
  }, [setData]);

  const submit = useCallback(() => {
    const cleanData = {
      ...data,
      text: data.text.trim(),
    };

    if (!cleanData.text) {
      textField.current.ref.current.select();
      return;
    }

    if (!dequal(cleanData, defaultData)) {
      onUpdate(cleanData);
    }

    close();
  }, [defaultData, onUpdate, data, close]);

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [open, close],
  );

  const handleFieldKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        submit();
      }
    },
    [submit],
  );

  const [handleFieldBlur, handleControlMouseOver, handleControlMouseOut] = useClosableForm(
    close,
    isOpened,
  );

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  useEffect(() => {
    if (isOpened) {
      textField.current.ref.current.select();
    }
  }, [isOpened]);

  if (!isOpened) {
    return children;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextArea
        ref={textField}
        as={TextareaAutosize}
        name="text"
        value={data.text}
        minRows={3}
        spellCheck={false}
        className={styles.field}
        onKeyDown={handleFieldKeyDown}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
      />
      <div className={styles.controls}>
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        <Button
          positive
          content={t('action.save')}
          onMouseOver={handleControlMouseOver}
          onMouseOut={handleControlMouseOut}
        />
      </div>
    </Form>
  );
});

EditComment.propTypes = {
  children: PropTypes.element.isRequired,
  defaultData: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onUpdate: PropTypes.func.isRequired,
};

export default React.memo(EditComment);
