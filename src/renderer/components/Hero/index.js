import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import ipfsConfig from '../../../shared/ipfs';
import styles from './styles';

const Hero = ({ classes, className, imageHash }) => (
  <section className={cx(classes.hero, className)}>
    {imageHash ? (
      <img className={classes.hero__image} src={`${ipfsConfig.IPFS_URL}${imageHash}`} alt="Hero" />
    ) : (
      <img className={classes.hero__image} src={require('../../assets/images/placeholder.jpg')} />
    )}
  </section>
);

export default injectStyles(styles)(Hero);
