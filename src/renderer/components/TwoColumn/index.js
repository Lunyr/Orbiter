import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { MdMenu as MenuIcon } from 'react-icons/md';
import styles from './styles';

const TwoColumn = ({ classes, children: [Sidebar, Main], onToggle, isOpened }) => (
  <section className={classes.container}>
    <aside
      className={cx({
        [classes.columnOne]: true,
        [classes.closed]: !isOpened,
      })}>
      {onToggle && <MenuIcon className={classes.toggler} onClick={onToggle} size={35} />}
      {Sidebar}
    </aside>
    <main className={classes.columnTwo}>{Main}</main>
  </section>
);

export default injectStyles(styles)(TwoColumn);
