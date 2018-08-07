import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { GoDash as DashIcon } from 'react-icons/go';
import styles from './styles';

const NavList = ({ activeLinkClass, classes, className, horizontal, items, title, showIcon }) => (
  <nav className={cx(classes.nav, className)}>
    {title && <h1 className={classes.title}>{title}</h1>}
    <ul className={cx(classes.list, horizontal && classes.horizontal)}>
      {items.map(({ display, icon, to, target, ...rest }, index) => {
        return (
          <li
            key={`${display}_${index}`}
            className={cx(classes.item, horizontal && classes.horizontal__item)}>
            {target ? (
              <a rel="noopener noreferrer" target={target} href={to} className={classes.link}>
                {showIcon && (
                  <div className={classes.icon}>
                    {!icon ? <DashIcon className={classes.navLinkIcon} /> : icon}
                  </div>
                )}
                <span className={classes.display}>{display}</span>
              </a>
            ) : (
              <NavLink
                {...rest}
                to={to}
                className={classes.link}
                activeClassName={`${cx(classes.active, classes.activeLink)} ${activeLinkClass}`}>
                {showIcon && (
                  <div className={classes.icon}>
                    {!icon ? <DashIcon className={classes.navLinkIcon} /> : icon}
                  </div>
                )}
                <span className={classes.display}>{display}</span>
              </NavLink>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

NavList.defaultProps = {
  // A class reference for active links
  activeLinkClass: '',
  // Orientation of the nav list
  horizontal: false,
  // Array of `Route` prop objects
  items: [],
  // Boolean to show an icon or not
  showIcon: true,
  // Style merge maps
  styles: {
    container: undefined,
    title: undefined,
    list: undefined,
    item: undefined,
    link: undefined,
    activeLink: undefined,
    icon: undefined,
    display: undefined,
  },
  // Title of the navlist to show above
  title: '',
};

const ItemRoutePropTypes = PropTypes.shape({
  to: PropTypes.string,
  exact: PropTypes.bool,
  icon: PropTypes.node,
  display: PropTypes.string,
});

NavList.propTypes = {
  horizontal: PropTypes.bool,
  items: PropTypes.arrayOf(ItemRoutePropTypes),
  showIcon: PropTypes.bool,
  styles: PropTypes.shape({
    container: PropTypes.object,
    title: PropTypes.object,
    list: PropTypes.object,
    item: PropTypes.object,
    link: PropTypes.object,
    activeLink: PropTypes.object,
    icon: PropTypes.object,
    display: PropTypes.object,
  }),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default injectStyles(styles)(NavList);
