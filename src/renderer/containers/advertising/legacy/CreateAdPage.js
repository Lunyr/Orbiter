/***
 * Page to deal with advertising
 * @patr -- patrick@quantfive.org
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

// Components
import SubHeader from '../header/SubHeader';
import SelectSlot from './createAdPages/SelectSlot';
import CreateAd from '../CreateAd/CreateAd';
import AdFrequency from '../CreateAd/AdFrequency';
import PreviewAndPublish from '../CreateAd/PreviewAndPublish';
import ReviewNextButton from '../review/ReviewNextButton';
import AdPreviewModal from '../modals/AdPreviewModal';
import GasModal from '../modals/GasModal/';
import PublishModal from '../modals/PublishModal';

// Redux
// Actions
import { ModalActions } from '../../redux/modals';
import { AdvertisingActions } from '../../redux/advertising';
import { IPFSActions } from '../../redux/ipfs';
import { GAS_AMT } from '../article/ArticleGasConsts';
import { Web3Actions } from '../../redux/web3';
import { MessageActions } from '../../redux/message';
import { NotificationActions } from '../../redux/notification';

// Config
import { LUN_CONVERSION } from '../../config/lun';
import theme from '../../theme';

const multihashes = window.Multihashes;
const SCOPE = 1; // auctioneer scope
var AD_GAS_AMT = 5.5e6;
const Raven = window.Raven;

class CreateAdPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lunPoolInUSD: 0,
      yourLunBalance: 0,
      adPeriodInDays: 0,
      nextAdPeriod: 0,
      LUNtoUSD: 0,
      percentLUNPool: 0,
    };
  }

  /***
   * Async function to send transaction to blockchain. We pass this to the gas modal.
   */
  sendTransaction = async gasPrice => {
    let {
      auth,
      modalActions,
      advertisingActions,
      advertising,
      web3,
      contracts,
      ipfsActions,
    } = this.props;

    let json = {
      ...advertising,
      bidValueLUN: advertising.bidValueLUN,
    };

    delete json.ads;
    delete json.reach;
    delete json.clicks;

    let jsonFile = new Blob([JSON.stringify(json)], { type: 'application/json' });
    let hash = await ipfsActions.ipfsAPI(jsonFile);

    if (!hash) {
      return { name: 'error', message: 'IPFS error' };
    }

    const buf = multihashes.fromB58String(hash).slice(2);
    const ipfsHash = '0x' + buf.toString('hex');

    let fromEthAddr = auth.account.profile.ethereumAddress;

    try {
      let { notificationActions } = this.props;
      let nonce;
      let lastTxHash = await notificationActions.getLatestTx(auth.account.ethereumAddress);
      if (lastTxHash) {
        let tx = web3.web3HTTP.eth.getTransaction(lastTxHash);
        let txCount = web3.web3HTTP.eth.getTransactionCount(fromEthAddr, 'pending');
        if (txCount === 0) {
          nonce = 0;
        } else if (tx) {
          nonce = txCount > tx.nonce + 1 ? txCount : tx.nonce + 1;
        } else {
          nonce = txCount;
        }
      } else {
        nonce = web3.web3HTTP.eth.getTransactionCount(fromEthAddr, 'pending');
      }

      // Gets the time period in days by subtracting start date from current day
      let timePeriod = advertising.endsOn - advertising.startsOn; //ad runs for one day
      timePeriod = new Date(timePeriod);
      let timePeriodInDays = timePeriod.getUTCDate() - 1;
      let timePeriodInAdPeriods = Math.floor(timePeriodInDays / this.state.adPeriodInDays);

      // Gas price between approval and bidRange
      let approvalGasPrice = Math.floor(gasPrice);
      let bidRangeGasPrice = Math.floor(gasPrice);

      // Approve the lun token being spent
      let approveTxHash = await contracts.LunyrToken.approve.sendTransaction(
        contracts.Auctioneer.address,
        web3.web3.toWei(advertising.bidValueLUN) + LUN_CONVERSION,
        { from: fromEthAddr, gas: GAS_AMT, gasPrice: approvalGasPrice, nonce: nonce }
      );

      notificationActions.watchTransaction(
        approveTxHash,
        fromEthAddr,
        auth.account.username,
        'approveLUN',
        null,
        null,
        null,
        null
      );

      // Splitting the LUN amt by the number of days the bid goes on for
      let lunamt = Math.floor(web3.web3.toWei(advertising.bidValueLUN) / timePeriodInAdPeriods);
      let txhash = await contracts.Auctioneer.bidRange.sendTransaction(
        SCOPE,
        this.state.startPeriod,
        timePeriodInAdPeriods,
        lunamt,
        ipfsHash,
        { from: fromEthAddr, gas: AD_GAS_AMT, gasPrice: bidRangeGasPrice, nonce: nonce + 1 }
      );

      this.setState({
        txhash,
      });

      await advertisingActions.postAdInformation(txhash);

      notificationActions.watchTransaction(
        txhash,
        fromEthAddr,
        auth.account.username,
        'createAd',
        null,
        null,
        null,
        null
      );

      modalActions.openGasModal(false);
      modalActions.openPublishModal(true);
      return txhash;
    } catch (err) {
      console.log(err);
      Raven.captureException(err);
      return err;
    }
  };

  /***
   * Calculates the percentage of time your ad will be up
   * @params string startDay -- the day which your ad starts on normalized against the start of the contract
   * @params string endDay -- the day which your ad ends on normalized against the start of the contract
   * @params num totalBidLUN -- the amt of LUN bid at precision
   */
  timePct = async (startPeriod, endPeriod, totalBidLUN) => {
    if (!startPeriod && !endPeriod) {
      this.setState({
        percentLUNPool: 100,
      });
      return;
    }

    totalBidLUN = totalBidLUN * 0.85; // LUN tax of 15%
    let { contracts } = this.props;
    let numDays = endPeriod - startPeriod;
    let dailyBid = totalBidLUN / numDays;
    let scope = 1;
    let totalPct = 0;
    let totalPool = 0;
    for (let day = startPeriod; day < endPeriod; day++) {
      let auctionId = await contracts.Auctioneer.getAuctionId(scope, day);
      // eslint-disable-next-line
      let [bidSum, ads, bids, bidders] = await contracts.Auctioneer.getAdsForAuction(auctionId);
      bidSum = bidSum / LUN_CONVERSION; // change bid from LUN to USD
      totalPool += bidSum;

      // TODO: make sure divideBy can't be 0 here..
      let divideBy = dailyBid ? dailyBid : 1;
      let dailyPct = dailyBid / (bidSum * 1.0 ? bidSum * 1.0 + dailyBid : divideBy);
      totalPct += dailyPct;
    }
    let lunPool = (totalPool * 1.0).toFixed(5);
    this.setState({
      percentLUNPool: (totalPct * 100 / numDays).toFixed(2),
      lunPoolInUSD: lunPool,
    });
  };

  /***
   * Sets up all auctioneer and LunyrTokens.
   * @params string ethereumAddress -- the eth address of the user we want to setup for
   * @params contract Auctioneer -- the auctioneer contract
   * @params contract LunyrToken -- the lunyr token contract
   */
  setupTokens = async (ethereumAddress, Auctioneer, LunyrToken) => {
    let { web3Actions } = this.props;
    if (Auctioneer) {
      let currentPeriod = await Auctioneer.getCurrentPeriod();
      let auctionId = await Auctioneer.getAuctionId(SCOPE, currentPeriod);
      // eslint-disable-next-line
      let [bidSum, ads, bids] = await Auctioneer.getAdsForAuction(auctionId);
      let adPeriod = await Auctioneer.adPeriod();

      // Get the start date of the next ad period
      let startTime = await Auctioneer.startTime();
      let startDate = new Date(0);
      let today = new Date();
      startDate.setUTCSeconds(startTime.toString());
      let adPeriodInDays = Math.floor(adPeriod / 86400);

      // Get the number of days since adPeriod started
      let timeDiff = Math.abs(today.getTime() - startDate.getTime());
      // Get the difference in days
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Find how many ad periods have passed
      let daysAddOn = Math.floor(diffDays / adPeriodInDays);
      startDate.setDate(startDate.getDate() + daysAddOn * adPeriodInDays + adPeriodInDays);

      this.setState({
        adPeriodInDays,
        nextAdPeriod: startDate,
        startTime,
      });

      if (LunyrToken) {
        // Get the LUN to USD conversion
        let yourLunBalance = await LunyrToken.balanceOf(ethereumAddress);
        let LUNtoUSD = await web3Actions.getUSDConversion('lunyr');
        yourLunBalance = (yourLunBalance.toString() / LUN_CONVERSION).toFixed(5);
        this.setState({
          yourLunBalance,
          LUNtoUSD,
        });
      }
    }
  };

  componentDidMount() {
    let { auth, contracts } = this.props;
    if (contracts.Auctioneer) {
      this.setupTokens(
        auth.account.profile.ethereumAddress,
        contracts.Auctioneer,
        contracts.LunyrToken
      );
    }
    mixpanel.track('advertising_create_opened');
  }

  componentWillReceiveProps(nextProps, nextState) {
    let startDate, startPeriod, endPeriod;

    if (
      nextProps.contracts.Auctioneer &&
      nextProps.contracts.LunyrToken &&
      (!this.props.contracts.Auctioneer || !this.props.contracts.LunyrToken)
    ) {
      this.setupTokens(
        this.props.auth.account.profile.ethereumAddress,
        nextProps.contracts.Auctioneer,
        nextProps.contracts.LunyrToken
      );
    }

    if (nextProps.advertising.startsOn !== this.props.advertising.startsOn) {
      startDate = new Date(0);
      startDate.setUTCSeconds(this.state.startTime.toString());
      startPeriod = Math.abs(nextProps.advertising.startsOn.getTime() - startDate.getTime());
      startPeriod = Math.ceil(startPeriod / (1000 * 3600 * 24));

      this.setState({
        startPeriod,
      });
    }

    if (nextProps.advertising.endsOn !== this.props.advertising.endsOn) {
      startDate = new Date(0);
      startDate.setUTCSeconds(this.state.startTime.toString());
      endPeriod = Math.abs(nextProps.advertising.endsOn.getTime() - startDate.getTime());
      endPeriod = Math.ceil(endPeriod / (1000 * 3600 * 24));

      this.setState({
        endPeriod,
      });
    }

    if (
      nextProps.advertising.startsOn &&
      nextProps.advertising.endsOn &&
      (nextProps.advertising.startsOn !== this.props.advertising.startsOn ||
        nextProps.advertising.endsOn !== this.props.advertising.endsOn)
    ) {
      this.timePct(
        startPeriod ? startPeriod : this.state.startPeriod,
        endPeriod ? endPeriod : this.state.endPeriod,
        nextProps.advertising.bidValueDollars
      );
    }
  }

  /***
   * Open gas modal onClick of place bid
   * @params
   */
  openGasModal = e => {
    let { modalActions } = this.props;
    e.preventDefault();
    modalActions.openGasModal(true);
  };

  render() {
    const {
      modalActions,
      advertisingActions,
      advertising,
      messageActions,
      ipfsActions,
      intl,
      auth,
    } = this.props;

    if (!auth.isLoggedIn) {
      return <Redirect to="/login" />;
    }

    return (
      <div className={css(styles.advertisingPage)}>
        <SubHeader
          subHeaderTitle={intl.formatMessage({
            id: 'createadpage_header',
            defaultMessage: 'Create Ad',
          })}
          location={this.props.match.path}
          headerStyles={styles.headerStyles}
        />
        <form className={css(styles.lower)} onSubmit={this.openGasModal}>
          <div className={css(styles.upper)}>
            <CreateAd
              updateAdInfo={advertisingActions.setAdInformation}
              openAdPreviewModal={modalActions.openAdPreviewModal}
              title={advertising.title}
              body={advertising.body}
              actionLabel={advertising.actionLabel}
              url={advertisingActions.url}
              ipfsUpload={ipfsActions.ipfsAPI}
              messageActions={messageActions}
            />
            <div className={css(styles.frequencyAndSlot)}>
              <SelectSlot
                updateAdInfo={advertisingActions.setAdInformation}
                selectSlot={this.selectSlot}
                adPeriodInDays={this.state.adPeriodInDays}
                nextAdPeriod={this.state.nextAdPeriod}
                timePct={this.timePct}
              />
              <AdFrequency
                lunPool={this.state.lunPoolInUSD}
                yourLunBalance={this.state.yourLunBalance}
                updateAdInfo={advertisingActions.setAdInformation}
                conversion={this.state.LUNtoUSD}
                timePct={this.timePct}
                percentLUNPool={this.state.percentLUNPool}
                startPeriod={this.state.startPeriod}
                endPeriod={this.state.endPeriod}
                messageActions={messageActions}
              />
            </div>
          </div>
          <PreviewAndPublish
            yourBid={advertising.bidValueDollars}
            lunPool={this.state.lunPoolInUSD}
            yourLunBalance={this.state.yourLunBalance}
            conversion={this.state.LUNtoUSD}
          />
          <div className={css(styles.buttons)}>
            <ReviewNextButton
              buttonText={intl.formatMessage({
                id: 'createadpage_confirm',
                defaultMessage: 'Confirm Purchase',
              })}
            />
          </div>
        </form>
        <AdPreviewModal />
        <PublishModal ad={true} txhash={this.state.txhash} />
        <GasModal
          sendTransaction={this.sendTransaction}
          gasAmt={AD_GAS_AMT + GAS_AMT}
          actionMessage={intl.formatMessage({
            id: 'createadpage_publish',
            defaultMessage: 'publish an ad',
          })}
          showLunPool={false}
        />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  advertisingPage: {},
  frequencyAndSlot: {
    '@media only screen and (min-width: 1024px)': {
      width: '50%',
    },
  },
  upper: {
    display: 'flex',
    margin: '20px',
    borderBottom: '1px solid #eee',
    paddingTop: '20px',
    '@media only screen and (max-width: 1024px)': {
      margin: 0,
      padding: 0,
      flexDirection: 'column',
    },
  },
  lower: {
    background: theme.colors.white,
    margin: theme.spacing,
    '@media only screen and (max-width: 1024px)': {
      margin: 0,
    },
  },
  buttons: {
    padding: '50px',
    display: 'flex',
    justifyContent: 'flex-end',
    '@media only screen and (max-width: 1024px)': {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      marginTop: theme.spacing,
      marginBottom: theme.spacing * 2,
    },
  },
  headerStyles: {
    '@media only screen and (max-width: 1024px)': {
      display: 'none',
    },
  },
});

const mapStateToProps = state => ({
  advertising: state.advertising,
  auth: state.auth,
  web3: state.web3,
  contracts: state.contracts,
  locale: state.localization.locale,
});

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  advertisingActions: bindActionCreators(AdvertisingActions, dispatch),
  web3Actions: bindActionCreators(Web3Actions, dispatch),
  messageActions: bindActionCreators(MessageActions, dispatch),
  notificationActions: bindActionCreators(NotificationActions, dispatch),
  ipfsActions: bindActionCreators(IPFSActions, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreateAdPage));
