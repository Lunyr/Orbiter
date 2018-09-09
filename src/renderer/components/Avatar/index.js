import React from 'react';
import injectStyles from 'react-jss';
import Blockies from 'react-blockies';
import cx from 'classnames';
import styles from './styles';

const Avatar = ({ classes, className, scale, seed, size }) => (
  <div className={cx(classes.avatar, className)}>
    <Blockies className={classes.block} scale={scale} seed={seed} size={size} />
  </div>
);

Avatar.defaultProps = {
  scale: 1,
  size: 40,
};

export default injectStyles(styles)(Avatar);
