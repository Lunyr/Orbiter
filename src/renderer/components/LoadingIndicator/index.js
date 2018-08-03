import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import styles from './styles';

const LoadingIndicator = ({ classes, className, fadeIn, full, name, showing }) => (
  <div
    className={cx(classes.container, full && classes.full, className, !showing && classes.hidden)}>
    {/* Find a decent loading indicator to put here */}
  </div>
);

LoadingIndicator.defaultProps = {
  name: 'ball-scale-ripple',
  showing: false,
};

export default injectStyles(styles)(LoadingIndicator);
