import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import styles from './styles';

const Card = ({ boxShadow, children, classes, className, header, headerClassName }) => {
  return (
    <div className={cx(classes.container, boxShadow && classes.boxShadow, className)}>
      {header && <div className={cx(classes.header, headerClassName)}>{header}</div>}
      <div className={classes.content}>{children}</div>
    </div>
  );
};

Card.defaultProps = {
  boxShadow: true,
  minHeight: 150,
  width: '100%',
};

export default injectStyles(styles)(Card);
