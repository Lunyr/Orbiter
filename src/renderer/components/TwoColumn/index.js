import React from 'react';
import injectStyles from 'react-jss';
import styles from './styles';

const TwoColumn = ({ classes, children: [Sidebar, Main] }) => (
  <section className={classes.container}>
    <aside className={classes.columnOne}>{Sidebar}</aside>
    <main className={classes.columnTwo}>{Main}</main>
  </section>
);

export default injectStyles(styles)(TwoColumn);
