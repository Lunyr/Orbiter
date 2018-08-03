import React from 'react';
import injectStyles from 'react-jss';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './styles';

const Logo = ({ classes, className, href }) => {
  const base = (
    <div className={cx(classes.container, className)}>
      {/*
      <img
        className={classes.image}
        src={require('../../../assets/images/Logo.svg')}
        alt="Lunyr Logo"
      />
      */}
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
  size: 32,
};

export default injectStyles(styles)(Logo);
