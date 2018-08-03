import React from 'react';
import injectStyles from 'react-jss';
import styles from '../styles';

export default injectStyles(styles)(
  ({ classes, touched, error, warning }) =>
    touched && (error || warning) ? (
      (error && <span className={classes.field__error}>{error}</span>) ||
      (warning && <span className={classes.field__warning}>{warning}</span>)
    ) : (
      <span />
    )
);