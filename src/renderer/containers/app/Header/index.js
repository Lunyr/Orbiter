import React from 'react';
import injectStyles from 'react-jss';
import { ButtonGroup, Link, Select } from '../../../components';
import Search from '../Search/';
import styles from './styles';

const IntlSelect = injectStyles((theme) => ({
  select: {
    width: 150,
    marginRight: theme.spacing,
  },
}))(({ classes }) => (
  <Select
    className={classes.select}
    options={[{ value: 'a', label: 'English' }]}
    value={{ value: 'a', label: 'English' }}
  />
));

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

export default injectStyles(styles)(Header);
