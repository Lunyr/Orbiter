import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import get from 'lodash/get';
import { ActionMenu, Avatar, Button, ButtonGroup, Link, Select } from '../../../components';
import Search from '../Search/';
import WalletOverview from './WalletOverview';
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

const onSelected = (history, { props }) => {
  if (props.to) {
    history.replace(props.to);
  }
};

const Header = ({ auth, classes, history, wallet }) => {
  const address = get(auth, 'account');
  const accounts = get(auth, 'accounts', []);
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
            <Link to="/login">Login</Link>
          ) : (
            <ActionMenu
              id="user-dropdown-menu"
              className={classes.menu}
              width={400}
              alignedRight
              onSelected={onSelected.bind(this, history)}>
              <span className={cx(classes.trigger, classes.header__item)}>
                <Avatar className={classes.avatar} seed={address} size={35} />
                {address ? `${address.substring(0, 16)}...` : 'N/A'}
              </span>
              <Link className={cx(classes.account, classes.header__item)} to="/wallet">
                <WalletOverview wallet={wallet} />
              </Link>
              {accounts.length > 1 && (
                <Link className={cx(classes.header__item, classes.link)} to="/login">
                  Switch Accounts
                </Link>
              )}
              <Link className={cx(classes.header__item, classes.link)} to="/logout">
                Logout
              </Link>
            </ActionMenu>
          )}
        </ButtonGroup>
      </div>
    </header>
  );
};

const mapStateToProps = ({ auth, wallet }) => ({ auth, wallet });

export default withRouter(connect(mapStateToProps)(injectStyles(styles)(Header)));
