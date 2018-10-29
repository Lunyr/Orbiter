import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { Button } from '../../../components';
import CreateAdForm from './CreateAdForm';
import AdDuration from './AdDuration';
import AdFrequency from './AdFrequency';
import PreviewAndPublish from './PreviewAndPublish';
import styles from './styles';

class CreateAd extends React.Component {
  state = {
    adPeriodInDays: 0,
    title: '',
    callToAction: '',
    body: '',
    url: '',
    startsOn: new Date(),
    endsOn: new Date(),
    yourBid: 0,
    nextAdPeriod: null,
    startTime: null,
  };

  handleFormChange = (key, value) => {
    this.setState({ [key]: value });
  };

  timePct = async (startPeriod, endPeriod, totalBidLUN) => {
    if (!startPeriod && !endPeriod) {
      this.setState({
        percentLUNPool: 100,
      });
      return;
    }

    totalBidLUN = totalBidLUN * 0.85; // LUN tax of 15%

    const { auctioneer } = remote.getGlobal('contracts');

    const numDays = endPeriod - startPeriod;
    const dailyBid = totalBidLUN / numDays;
    const scope = 1;
    let totalPct = 0;
    let totalPool = 0;
    for (let day = startPeriod; day < endPeriod; day++) {
      const auctionId = await auctioneer.methods.getAuctionId(scope, day).call();
      // eslint-disable-next-line
      const adsForAuction = await auctioneer.methods.getAdsForAuction(auctionId).call();

      // change bid from LUN to USD
      let bidSum = adsForAuction[0] / 1e18;
      totalPool += bidSum;

      // TODO: make sure divideBy can't be 0 here..
      const divideBy = dailyBid ? dailyBid : 1;
      const dailyPct = dailyBid / (bidSum * 1.0 ? bidSum * 1.0 + dailyBid : divideBy);
      totalPct += dailyPct;
    }

    const lunPool = (totalPool * 1.0).toFixed(5);
    this.setState({
      percentLUNPool: ((totalPct * 100) / numDays).toFixed(2),
      lunPoolInUSD: lunPool,
    });
  };

  submit = () => {};

  getAuctioneerInformation = async () => {
    try {
      const { auctioneer } = remote.getGlobal('contracts');

      if (auctioneer) {
        //  Derive the next ad period available
        const currentPeriod = await auctioneer.methods.getCurrentPeriod().call();
        const auctionId = await auctioneer.methods.getAuctionId(1, currentPeriod).call();
        const adsForAuction = await auctioneer.methods.getAdsForAuction(auctionId).call();
        const adPeriod = await auctioneer.methods.adPeriod().call();

        // Get the start date of the next ad period
        const startTime = await auctioneer.methods.startTime().call();
        const nextAdPeriod = new Date(0);
        const today = new Date();
        nextAdPeriod.setUTCSeconds(startTime.toString());
        const adPeriodInDays = Math.floor(adPeriod / 86400);

        // Get the number of days since adPeriod started
        const timeDiff = Math.abs(today.getTime() - nextAdPeriod.getTime());
        // Get the difference in days
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Find how many ad periods have passed
        const daysAddOn = Math.floor(diffDays / adPeriodInDays);
        nextAdPeriod.setDate(nextAdPeriod.getDate() + daysAddOn * adPeriodInDays + adPeriodInDays);

        this.setState({
          adPeriodInDays,
          nextAdPeriod,
          startTime,
          bidSum: adsForAuction[0],
          ads: adsForAuction[1],
          bids: adsForAuction[2],
          bidders: adsForAuction[3],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  componentDidUpdate({ address }) {
    if ((!address && this.props.address) || this.props.address !== address) {
      this.getAuctioneerInformation();
    }
  }

  componentDidMount() {
    if (this.props.address) {
      this.getAuctioneerInformation();
    }
  }

  render() {
    const { address, balances, conversion, rewards, classes } = this.props;
    const {
      adPeriodInDays,
      title,
      callToAction,
      body,
      url,
      startsOn,
      endsOn,
      yourBid,
      percentLUNPool,
      nextAdPeriod,
    } = this.state;
    const canSubmit = title && callToAction && body && url && startsOn && endsOn && yourBid;
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <span className={classes.myAdsTitle}>
            <FormattedMessage id="ads_create" defaultMessage="Create Ad" />
          </span>
        </div>
        <div className={classes.body}>
          {!address ? (
            <p className={classes.help}>You must be logged in to create an ad!</p>
          ) : (
            <form className={classes.lower} onSubmit={this.submit}>
              <div className={classes.upper}>
                <CreateAdForm
                  title={title}
                  callToAction={callToAction}
                  body={body}
                  url={url}
                  onChange={this.handleFormChange}
                />
                <div className={classes.frequencyAndSlot}>
                  <AdDuration
                    startsOn={startsOn}
                    endsOn={endsOn}
                    adPeriodInDays={adPeriodInDays}
                    nextAdPeriod={nextAdPeriod}
                    onChange={this.handleFormChange}
                  />
                  <AdFrequency
                    conversion={conversion.lunToUsd}
                    lunPool={rewards.pool}
                    yourLunBalance={balances.lunyr}
                    onChange={this.handleFormChange}
                    percentLUNPool={percentLUNPool}
                  />
                </div>
              </div>
              <PreviewAndPublish
                conversion={conversion.lunToUsd}
                yourBid={yourBid}
                lunPool={rewards.pool}
                yourLunBalance={balances.lunyr}
              />
              <div className={classes.buttons}>
                <Button
                  className={classes.write}
                  theme="primary"
                  value="Create Advertisement"
                  disabled={canSubmit}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ wallet: { address, balances, conversion, rewards } }) => ({
  address,
  balances,
  conversion,
  rewards,
});

export default connect(mapStateToProps)(injectStyles(styles)(CreateAd));
