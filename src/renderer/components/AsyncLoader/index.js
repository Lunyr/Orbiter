import React from 'react';
import injectStyles from 'react-jss';
import styles from './styles';

export default injectStyles(styles)(({ classes, error, isLoading, pastDelay, timedOut }) => {
  if (isLoading) {
    if (timedOut) {
      return <div className={classes.container}>Loader timed out!</div>;
    } else if (pastDelay) {
      return <div className={classes.container}>Loading...</div>;
    } else {
      return null;
    }
  } else if (error) {
    return <div className={classes.container}>Error! Component failed to load</div>;
  } else {
    return null;
  }
});
