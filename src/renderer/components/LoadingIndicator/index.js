import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { ThreeBounce } from 'better-react-spinkit';
import styles from './styles';

const LoadingIndicator = ({ classes, className, full, showing, size }) => (
  <div
    className={cx(classes.container, full && classes.full, className, !showing && classes.hidden)}>
    <ThreeBounce className={cx(classes.loader, className)} gutter={4} size={size} />
  </div>
);

LoadingIndicator.defaultProps = {
  showing: false,
  size: 20,
};

export default injectStyles(styles)(LoadingIndicator);
