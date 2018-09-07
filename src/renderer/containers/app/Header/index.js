import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import get from 'lodash/get';
import { ActionMenu, Avatar, Button, ButtonGroup, Link, Select } from '../../../components';
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

const Header = ({ auth, classes }) => {
  const address = get(auth, 'account');
  return (
    <header className={classes.container}>
      <Search />
      <div className={classes.right}>
        <ButtonGroup>
          <IntlSelect />
          {auth.isLoggedIn && (
            <Link to="/draft">
              <Button className={classes.write} theme="primary" value="Write" />
            </Link>
          )}
          {!auth.isLoggedIn ? (
            <Link to="/login" isModal={true}>
              Login
            </Link>
          ) : (
            <ActionMenu
              id="user-dropdown-menu"
              className={classes.menu}
              itemHeight={45}
              width={250}
              alignedRight>
              <span className={classes.trigger}>
                <Avatar className={classes.avatar} seed={address} size={35} />
                {address ? `${address.substring(0, 16)}...` : 'N/A'}
              </span>
              <div className={classes.address} tabIndex="-1">
                <span className={classes.address__value}>{address}</span>
              </div>
              <Link to="/logout">Logout</Link>
            </ActionMenu>
          )}
        </ButtonGroup>
      </div>
    </header>
  );
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps)(injectStyles(styles)(Header));
