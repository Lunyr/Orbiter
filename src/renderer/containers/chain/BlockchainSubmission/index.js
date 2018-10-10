import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import {
  MdInfo as CircleInfoIcon,
  MdClose as CloseIcon,
  MdRefresh as RefreshIcon,
} from 'react-icons/md';
import { FaPaperPlane as PaperPlaneIcon } from 'react-icons/fa';
import cx from 'classnames';
import find from 'lodash/find';
import get from 'lodash/get';
import { unlock } from '../../../../lib/accounts';
import { fetchAccountInformation } from '../../../../shared/redux/modules/wallet/actions';
import { fromWei, gweiToUsd } from '../../../../shared/utils';
import { Button, ButtonGroup, ErrorBoundary, LoadingIndicator, Tooltip } from '../../../components';
import ChooseGasPrice from './ChooseGasPrice/';
import styles from './styles';

const GasHeader = ({ classes, onClose, onRefresh, title }) => (
  <div className={classes.header}>
    <h1 className={classes.header__title}>
      <PaperPlaneIcon className={classes.header__icon} size={24} />
      {title}
    </h1>
    <ButtonGroup>
      <RefreshIcon className={classes.refresh} onClick={onRefresh} size={24} />
      <CloseIcon className={classes.close} onClick={onClose} size={24} />
    </ButtonGroup>
  </div>
);

const LUNPoolDisplay = ({ classes, pool, poolUsd }) => (
  <div className={classes.container}>
    <label className={cx(classes.title, classes.responsiveLabel)}>
      <FormattedMessage id="gasmodal_rewardPool" defaultMessage="Reward Pool" />
    </label>
    <span className={classes.value}>
      ${poolUsd}
      <span className={classes.conversion}>&asymp; {pool} LUN</span>
    </span>
  </div>
);

const CBNReceivedDisplay = ({ classes, lunyrConversionRate, rewards }) => {
  const { successCbn, successDescription, failDescription, cpToLunyr } = rewards;
  const cbnInUsd = (cpToLunyr * lunyrConversionRate).toFixed(2);
  return (
    <div className={classes.container}>
      <label className={cx(classes.title, classes.responsiveLabel)}>
        Contribution Points (CP) Rewarded
      </label>
      <span className={cx(classes.value, classes.success)}>
        {successCbn} CP
        <span className={cx(classes.conversion)}>
          &asymp; {cpToLunyr.toFixed(5)} LUN &asymp; ${cbnInUsd}
        </span>
      </span>
      <div className={classes.tooltip}>
        <CircleInfoIcon
          data-tip
          data-for="cbn-received-display"
          className={classes.circleInfoIcon}
          size={24}
        />
        <Tooltip
          id="cbn-received-display"
          place="left"
          type="dark"
          effect="float"
          aria-haspopup="true">
          <div>
            <p className={classes.desc}>{successDescription}</p>
            <p className={classes.desc}>{failDescription}</p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

class BlockchainSubmission extends React.Component {
  static defaultProps = {
    additionalGwei: 2.5,
    modifier: 1,
    stepSize: 0.5,
  };

  state = {
    isInitialized: false,
    error: null,
    password: '',
    submitting: false,
  };

  errorToErrorMessage = (txResponse) => {
    const { intl } = this.props;
    if (!txResponse) {
      return intl.formatMessage({
        id: 'gasmodal_error_somethingWentWrong',
        defaultMessage: 'Something went wrong! Please try again later.',
      });
    }
    if (
      txResponse.message.includes('Unknown address - unable to sign transaction for this address')
    ) {
      return intl.formatMessage({
        id: 'gasmodal_error_accountIssue',
        defaultMessage:
          "We've detected an issue with your account. Please email us at support@lunyr.com to get your issue resolved!",
      });
    }
    switch (txResponse.message) {
      case 'transaction underpriced':
        return intl.formatMessage({
          id: 'gasmodal_error_lowGas',
          defaultMessage: 'The gas fee is too low! Please choose a higher price.',
        });
      case 'Insufficient funds for gas * price + value':
        return intl.formatMessage({
          id: 'gasmodal_error_funds',
          defaultMessage: 'Insufficient funds to process the transaction.',
        });
      case 'Error: HTTP/2.0 429':
        return 'Wait a bit and then try again!';
      default:
        return txResponse.message;
    }
  };

  /**
   * Get the safeLow gwei from ethgasstation
   * @returns {Promise<Response>}
   */
  getGasInformation = () => {
    return window
      .fetch('https://ethgasstation.info/json/ethgasAPI.json')
      .then((res) => res.json())
      .catch(() => {
        console.warn('Could not retrieve gas price from ethgasstation.');
        // attempt fallback against infura
        /*
        return fetch('https://api.infura.io/v1/jsonrpc/mainnet/eth_gasPrice')
          .then((res) => res.json())
          .then(({ result }) => ({ gasPrice: result.gasPrice }))
          .catch(() => {
            this.setState({
              error:
                'Could not fetch current safe low from ethgasstation or infura. Please try again later.',
            });
          });
          */
        this.setState({
          error:
            'Could not fetch current safe low from ethgasstation or infura. Please try again later.',
        });
      });
  };

  /**
   * Get the usd conversion rate from coinmarket cap
   * @param coin
   * @returns {Promise<Response>}
   */
  getUSDConversion = (coin) => {
    return window
      .fetch(`https://api.coinmarketcap.com/v1/ticker/${coin}/`)
      .then((res) => res.json())
      .then((data) => {
        const { price_usd } = find(data, ({ id }) => id === coin);
        return price_usd;
      })
      .catch(() => {
        this.setState({
          error:
            'Could not fetch current USD conversion rates from coinmarketcap. Please try again later.',
        });
      });
  };

  cpToLunyr = (totalCp, poolTotal, cp) => {
    return totalCp * poolTotal > 0 ? ((1.0 * cp) / totalCp) * poolTotal : 0;
  };

  setupChainContext = async () => {
    try {
      const web3 = remote.getGlobal('web3');
      const gasAmount = this.props.gasAmount || 1e6;
      // Retrieve safe low
      const { safeLow: originalSafeLow, ...stationInfo } = await this.getGasInformation();
      // Base step size increase
      const safeLow = originalSafeLow / 10;
      // Retrieve gas price oracle
      const oracleGasFee = await web3.eth.getGasPrice().then(fromWei);
      // Get lunyr conversion rate
      const lunyrConversionRate = await this.getUSDConversion('lunyr').then(parseFloat);
      // Get eth conversion rate
      const ethereumConversionRate = await this.getUSDConversion('ethereum').then(parseFloat);
      // Derive base fee in usd from the safeLow
      const fee = parseFloat(gweiToUsd(safeLow + 0.5, gasAmount, ethereumConversionRate));

      console.debug(
        'Gas Fees',
        gasAmount,
        fee,
        safeLow,
        stationInfo,
        oracleGasFee,
        lunyrConversionRate,
        ethereumConversionRate
      );

      const { intl, type, wallet } = this.props;

      // Add in rewards information based on submission type
      const {
        environment: {
          majorityVoteCpReward,
          minorityVoteCpPunishment,
          majorityVoteHpReward,
          minorityVoteHpPunishment,
          createCpReward,
          editCpReward,
          rejectCpPunishment,
          createHpReward,
          editHpReward,
          rejectHpPunishment,
        },
        rewards: { pool: poolAsString, totalCp },
      } = wallet;

      // Calculate pool information
      const pool = parseFloat(poolAsString);
      const poolUsd = parseFloat(pool * lunyrConversionRate).toFixed(2);

      const newState = {
        isInitialized: true,
        gasAmount,
        fee,
        feeInGwei: safeLow + 0.5,
        oracleGasFee,
        lunyrConversionRate,
        ethereumConversionRate,
        pool,
        poolUsd,
        safeLow,
        stationInfo,
      };

      switch (type) {
        case 'peer-review':
          newState.rewards = {
            successCbn: majorityVoteCpReward,
            failCbn: minorityVoteCpPunishment,
            successHnr: majorityVoteHpReward,
            failHnr: minorityVoteHpPunishment,
            successDescription: `${intl.formatMessage({
              id: 'gasmodal_vote_majority',
              defaultMessage: 'Voting with the majority gains',
            })} ${majorityVoteCpReward} Contribution Points and ${majorityVoteHpReward} Honor Points.`,
            failDescription: `${intl.formatMessage({
              id: 'gasmodal_vote_minority',
              defaultMessage: 'Voting against the majority will lose',
            })} ${minorityVoteCpPunishment} Contribution Points
                and ${minorityVoteHpPunishment} Honor Points.`,
            cpToLunyr: this.cpToLunyr(totalCp, pool, majorityVoteCpReward),
          };
          break;
        case 'publish-article':
          newState.rewards = {
            successCbn: createCpReward,
            failCbn: rejectCpPunishment,
            successHnr: createHpReward,
            failHnr: rejectHpPunishment,
            successDescription: `${intl.formatMessage({
              id: 'gasmodal_submission_pass',
              defaultMessage: 'Submissions that pass peer review gain',
            })} ${createCpReward} Contribution Points and ${createHpReward} Honor Points.`,
            failDescription: '',
            cpToLunyr: this.cpToLunyr(totalCp, pool, createCpReward),
          };
          break;
        case 'edit-article':
          newState.rewards = {
            successCbn: editCpReward,
            failCbn: rejectCpPunishment,
            successHnr: editHpReward,
            failHnr: rejectHpPunishment,
            successDescription: `${intl.formatMessage({
              id: 'gasmodal_submission_pass',
              defaultMessage: 'Submissions that pass peer review gain',
            })} ${editCpReward} Contribution Points and ${editHpReward} Honor Points.`,
            failDescription: '',
            cpToLunyr: this.cpToLunyr(totalCp, pool, createCpReward),
          };
          break;

        case 'propose-tag':
          newState.rewards = {};
          break;

        default:
          console.warn('Unknown gas modal type seen', type);
          newState.rewards = {};
          break;
      }

      this.setState(newState);
    } catch (err) {
      console.warn(err);
      this.setState({
        error: err.message,
      });
    }
  };

  handleSliderChange = (gwei) => {
    this.setState(({ ethereumConversionRate, gasAmount }) => ({
      fee: gweiToUsd(gwei, gasAmount, ethereumConversionRate),
      feeInGwei: gwei,
    }));
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    this.setState({ submitting: true, error: null }, async () => {
      try {
        const { onClose, onSubmit, wallet } = this.props;
        const { password, feeInGwei } = this.state;
        const address = get(wallet, 'address');
        const privateKey = await unlock({ address, password });
        if (!privateKey) {
          throw new Error('Invalid Password');
        }
        onSubmit(privateKey, feeInGwei);
        this.setState({ submitting: false, error: null }, () => {
          onClose();
        });
      } catch (err) {
        console.warn(err);
        this.setState({ submitting: false, error: 'The password you entered was incorrect.' });
      }
    });
  };

  load = () => {
    const account = get(this.props, ['auth', 'account']);
    if (account) {
      this.setState(
        { isInitialized: false, error: null },
        this.props.fetchAccountInformation.bind(this, account)
      );
    }
  };

  componentDidUpdate({ isFetching }) {
    // Ensure we have the latest user information then fire off gas price initialization
    if (!this.props.isFetching && this.props.isFetching !== isFetching) {
      // Fetch current gas prices, conversions, and rewards based on the submission type
      this.setupChainContext();
    }
  }

  componentDidMount() {
    this.load();
  }

  render() {
    const {
      error,
      ethereumConversionRate,
      fee,
      gasAmount,
      isInitialized,
      lunyrConversionRate,
      password,
      pool,
      poolUsd,
      rewards,
      safeLow,
      submitting,
    } = this.state;
    const { classes, onClose, title, wallet } = this.props;
    const balance = get(wallet, ['balances', 'ethereum']);
    const hasEnoughBalance = balance * ethereumConversionRate >= fee;
    return (
      <ErrorBoundary error={error}>
        <div className={classes.blockchain}>
          <GasHeader classes={classes} onClose={onClose} onRefresh={this.load} title={title} />
          <div className={classes.body}>
            {!isInitialized ? (
              <div className={classes.loading__container}>
                <LoadingIndicator
                  id="block-chain-submission-loading-indicator"
                  fadeIn="quarter"
                  showing={true}
                  text={
                    <FormattedMessage
                      id="gasmodal_retrievingConversions"
                      defaultMessage="Retrieving Gas Conversion Information"
                    />
                  }
                />
              </div>
            ) : (
              <React.Fragment>
                <div className={classes.poolInfo}>
                  <LUNPoolDisplay classes={classes} pool={pool} poolUsd={poolUsd} />
                  <CBNReceivedDisplay
                    classes={classes}
                    lunyrConversionRate={lunyrConversionRate}
                    rewards={rewards}
                  />
                </div>
                <div className={classes.priceContainer}>
                  <ChooseGasPrice
                    additionalGwei={2.5}
                    balance={balance}
                    fee={fee}
                    gasAmount={gasAmount}
                    gweiLow={safeLow}
                    modifier={1}
                    onSliderChangeFee={this.handleSliderChange}
                    showing={true}
                    stepSize={0.5}
                    ethereumConversionRate={ethereumConversionRate}
                  />
                </div>
                <form className={classes.footer} onSubmit={this.submit}>
                  {error && <p className={classes.footer__error}>{error}</p>}
                  <div className={classes.footer__inner}>
                    {!hasEnoughBalance ? (
                      <Link className={classes.link} to="/wallet">
                        <span>Not Enough Ether, Deposit Now</span>
                      </Link>
                    ) : (
                      <React.Fragment>
                        <input
                          className={classes.footer__input}
                          onChange={this.handlePasswordChange}
                          placeholder="Enter Password"
                          type="password"
                          value={password}
                          required={true}
                        />
                        <Button
                          className={classes.footer__button}
                          disabled={submitting || !password}
                          theme="primary"
                          type="submit"
                          value={submitting ? 'Verifying...' : 'Submit'}
                        />
                      </React.Fragment>
                    )}
                  </div>
                </form>
              </React.Fragment>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ auth, wallet }) => ({
  auth,
  wallet,
  isFetching: wallet.isFetching,
});

export default withRouter(
  connect(
    mapStateToProps,
    { fetchAccountInformation }
  )(injectIntl(injectStyles(styles)(BlockchainSubmission)))
);
