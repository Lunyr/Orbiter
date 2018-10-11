import React from 'react';
import get from 'lodash/get';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { ErrorBoundary, LoadingIndicator } from '../../../../components';
import styles from './styles';

const WalletOverview = ({ classes, wallet }) => (
  <ErrorBoundary error={wallet.error}>
    <div className={classes.container}>
      <LoadingIndicator
        id="wallet-loading-indicator"
        className={classes.loader}
        fadeIn="quarter"
        showing={get(wallet, 'isFetching', false)}
        size={12}
      />
      <span className={cx(classes.header, classes.header__address)}>My Address</span>
      <div className={cx(classes.item, classes.address)}>{get(wallet, 'address', '-')}</div>
      <span className={classes.header}>My Balances</span>
      <ul className={classes.list}>
        <li className={classes.item}>
          <span>
            Ethereum (ETH):
            <span className={classes.value}>{get(wallet, ['balances', 'ethereum'], '-')}</span>
          </span>
        </li>
        <li className={classes.item}>
          <span>
            Lunyr (LUN):
            <span className={classes.value}>{get(wallet, ['balances', 'lunyr'], '-')}</span>
          </span>
        </li>
      </ul>
      <span className={classes.header}>My Rewards</span>
      <ul className={classes.list}>
        <li className={classes.item}>
          <span>
            Contribution Points (CP):
            <span className={classes.value}>{get(wallet, ['rewards', 'cp'], '-')}</span>
          </span>
        </li>
        <li className={classes.item}>
          <span>
            Honor Points (HP):
            <span className={classes.value}>{get(wallet, ['rewards', 'hp'], '-')}</span>
          </span>
        </li>
      </ul>
      <span className={classes.header}>Our Community</span>
      <ul className={classes.list}>
        <li className={classes.item}>
          <span>
            LUN Pool:
            <span className={classes.value}>{get(wallet, ['rewards', 'pool'], '-')}</span>
          </span>
        </li>
        <li className={classes.item}>
          <span>
            Total CP:
            <span className={classes.value}>{get(wallet, ['rewards', 'totalCp'], '-')}</span>
          </span>
        </li>
      </ul>
    </div>
  </ErrorBoundary>
);

export default injectStyles(styles)(WalletOverview);
