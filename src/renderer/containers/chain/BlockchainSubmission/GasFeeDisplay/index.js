import React from 'react';
import { FormattedMessage } from 'react-intl';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { normalizeBalance, usdToEth } from '../../../../../shared/utils';
import styles from './styles';

const GasFeeDisplay = ({ balance, classes, fee, ethereumConversionRate }) => {
  const gasFeeDisplay = usdToEth(fee, ethereumConversionRate);
  const ethWalletDisplay = normalizeBalance(balance);
  return (
    <div className={classes.gasFee}>
      <div className={classes.gasChoice}>
        <div>
          <label className={classes.label}>
            <FormattedMessage id="gasmodal_totalGasFee" defaultMessage="Total Gas Fee" />
          </label>
          <div className={classes.gasFeeDisplay}>
            <div className={cx(classes.gasValue, classes.input, classes.disabled)}>{`$${fee}`}</div>
            <span className={cx(classes.gasValue, classes.conversion, classes.error)}>
              <span className={classes.ethEstimation}>{`~ ${gasFeeDisplay} ETH`}</span>
            </span>
          </div>
        </div>
        <div className={classes.balanceGroup}>
          <label className={classes.label}>
            <FormattedMessage id="gasmodal_yourBalance" defaultMessage="Your Balance" />
          </label>
          <div disabled className={cx(classes.input, classes.balance, classes.disabled)}>
            {`${ethWalletDisplay} ETH `}
          </div>
        </div>
      </div>
    </div>
  );
};

export default injectStyles(styles)(GasFeeDisplay);
