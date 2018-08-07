import React from 'react';
import injectStyles from 'react-jss';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './styles';

const Logo = ({ classes, className, href }) => {
  const base = (
    <div className={cx(classes.container, className)}>
      <img
        className={classes.image}
        src="https://s3-us-west-2.amazonaws.com/lunyr-assets/Logo.svg"
        alt="Lunyr Logo"
      />
      <h1 className={classes.title}>Lunyr</h1>
    </div>
  );
  return href ? (
    <Link className={classes.link} to={href}>
      {base}
    </Link>
  ) : (
    base
  );
};

Logo.defaultProps = {
  size: 28,
};

export default injectStyles(styles)(Logo);
