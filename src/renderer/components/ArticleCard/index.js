import React from 'react';
import injectStyles from 'react-jss';
import { timeAgoDisplay } from '../../../shared/utils';
import styles from './styles';

const ArticleCard = ({
  article: { createdAt, description, heroImageHash, title, updatedAt },
  classes,
  onClick,
}) => (
  <div className={classes.card} onClick={onClick}>
    <img
      className={classes.image}
      src={heroImageHash ? `https://ipfs.io/ipfs/${heroImageHash}` : require('./placeholder.jpg')}
      alt="Uh oh, can't be found!"
    />
    <div className={classes.info}>
      <div className={classes.info__header}>
        <h3 className={classes.title}>{title}</h3>
        <span className={classes.timestamp}>
          {timeAgoDisplay(updatedAt ? updatedAt : createdAt)}
        </span>
      </div>
      <p className={classes.help}>{description || 'No Content Added'}</p>
    </div>
  </div>
);

export default injectStyles(styles)(ArticleCard);
