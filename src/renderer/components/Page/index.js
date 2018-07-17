import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import styles from './styles';

const Page = ({ centered, classes, children, contentClassName }) => {
  if (React.Children.count(children) === 1) {
    return (
      <section className={classes.container}>
        <div
          className={cx(
            classes.content__container,
            centered && classes.centered,
            contentClassName
          )}>
          {children}
        </div>
      </section>
    );
  }
  const [Header, Content, Footer] = children;
  return (
    <section className={classes.container}>
      {Header && <header className={classes.header__container}>{Header}</header>}
      <div
        className={cx(classes.content__container, centered && classes.centered, contentClassName)}>
        {Content}
      </div>
      {Footer && <footer className={classes.footer__container}>{Footer}</footer>}
    </section>
  );
};

export default injectStyles(styles)(Page);
