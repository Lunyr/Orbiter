import React from 'react';
import injectStyles from 'react-jss';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

const Link = ({ activeClassName, classes, isModal, to, ...props }) => (
  <NavLink
    activeClassName={cx(classes.active, activeClassName)}
    className={classes.link}
    to={{
      pathname: to,
      state: { modal: isModal },
    }}
    {...props}
  />
);

const styles = (theme) => ({
  link: {
    textDecoration: 'none',
    transition: 'all 0.2s linear',
    color: theme.colors.link,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  active: {
    textDecoration: 'underline',
  },
});

Link.defaultProps = {
  isModal: false,
};

export default injectStyles(styles)(Link);
