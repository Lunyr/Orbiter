import React from 'react';
import injectStyles from 'react-jss';
import TextAreaAutoSize from 'react-textarea-autosize';
import styles from './styles';

const TitleEditor = ({ classes, disabled, onChange, placeholder, rows, value }) => (
  <TextAreaAutoSize
    className={classes.container}
    disabled={disabled}
    placeholder={placeholder}
    onChange={onChange}
    rows={rows}
    value={value || ''}
  />
);

TitleEditor.defaultProps = {
  disabled: false,
  placeholder: 'Title...',
  rows: 1,
  value: '',
};

export default injectStyles(styles)(TitleEditor);
