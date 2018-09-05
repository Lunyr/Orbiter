import React from 'react';
import injectStyles from 'react-jss';
import styles from './styles';

const Grid = ({ classes, children }) => (
  <div className={classes.container}>
    <div className={classes.grid}>
      {React.Children.map(children, (child) => (
        <div className={classes.grid__item}>
          <div className={classes.grid__inner}>
            <div className={classes.item}>{child}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default injectStyles(styles)(Grid);
