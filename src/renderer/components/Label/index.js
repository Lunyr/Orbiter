import React from 'react';
import PropTypes from 'prop-types';
import injectStyles from 'react-jss';
import cx from 'classnames';
import styles from './styles';

const Label = ({ classes, className, valueClassName, type, value }) => (
  <div className={cx(classes.label, classes[type], className)}>
    <span className={cx(classes.value, valueClassName)}>{value}</span>
  </div>
);

Label.defaultProps = {
  type: 'primary',
};

Label.propTypes = {
  type: PropTypes.string,
  value: PropTypes.any.isRequired,
};

export default injectStyles(styles)(Label);
