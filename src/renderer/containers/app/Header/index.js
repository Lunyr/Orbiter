import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Route, Switch, withRouter } from 'react-router-dom';
import cx from 'classnames';
import get from 'lodash/get';
import { MdMenu as MenuIcon } from 'react-icons/md';
import { openSidebar } from '../../../../shared/redux/modules/app/actions';
import { ActionMenu, Avatar, Button, ButtonGroup, Link, Select } from '../../../components';
import DraftHeader from '../../article/Draft/DraftHeader/';
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

const Header = ({ auth, classes, history, openSidebar, sideBarOpened, wallet }) => {
  const address = get(auth, 'account');
  const accounts = get(auth, 'accounts', []);
  const userMenu = (
    <ActionMenu
      id="user-dropdown-menu"
      className={classes.menu}
      width={400}
      alignedRight
      onSelected={onSelected.bind(this, history)}>
      <span className={classes.trigger}>
        <Avatar className={classes.avatar} seed={address} size={35} />
        {address ? `${address.substring(0, 16)}...` : 'N/A'}
      </span>
      <Link className={cx(classes.account, classes.header__item)} to="/wallet">
        <WalletOverview wallet={wallet} />
      </Link>
      {accounts.length > 0 && (
        <Link className={cx(classes.header__item, classes.link, classes.padded)} to="/login">
          Switch Accounts
        </Link>
      )}
      <Link
        className={cx(classes.header__item, classes.link, classes.padded, classes.logout)}
        to="/logout">
        Logout
      </Link>
    </ActionMenu>
  );
  return (
    <header className={classes.container}>
      {!sideBarOpened && <MenuIcon className={classes.toggler} onClick={openSidebar} size={25} />}
      <div className={classes.container__inner}>
        <Switch>
          <Route
            exact
            path="/draft/:uuid"
            render={(routeProps) => (
              <React.Fragment>
                <DraftHeader {...routeProps} />
                {userMenu}
              </React.Fragment>
            )}
          />
          <Route
            render={(routeProps) => (
              <React.Fragment>
                <Search {...routeProps} />
                <ButtonGroup>
                  {/*
                  <IntlSelect />
                  */}
                  {/*
                  auth.isLoggedIn && <Link className={classes.tx} to="/transactions">Transactions</Link>
                  */}
                  {auth.isLoggedIn && (
                    <Link to="/draft">
                      <Button className={classes.write} theme="primary" value="Write" />
                    </Link>
                  )}
                  {!auth.isLoggedIn ? <Link to="/login">Login</Link> : userMenu}
                </ButtonGroup>
              </React.Fragment>
            )}
          />
        </Switch>
      </div>
    </header>
  );
};

const mapStateToProps = ({ app: { sideBarOpened }, auth, wallet }) => ({
  auth,
  sideBarOpened,
  wallet,
});

export default withRouter(
  connect(
    mapStateToProps,
    { openSidebar }
  )(injectStyles(styles)(Header))
);
