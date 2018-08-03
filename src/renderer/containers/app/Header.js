import React from 'react';
import injectStyles from 'react-jss';
import { ButtonGroup, Link } from '../../components';

const Search = () => <div>Search Here</div>;

const IntlSelect = () => <div>Intl Selector</div>;

const Header = ({ classes }) => (
  <header className={classes.container}>
    <Search />
    <div className={classes.right}>
      <ButtonGroup>
        <IntlSelect />
        <Link to="/login" isModal={true}>
          Login
        </Link>
      </ButtonGroup>
    </div>
  </header>
);

const styles = (theme) => ({
  container: ({ height }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
    backgroundColor: theme.colors.white,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
  }),
  right: {
    display: 'flex',
    justifyConten: 'flex-end',
  },
});

export default injectStyles(styles)(Header);
