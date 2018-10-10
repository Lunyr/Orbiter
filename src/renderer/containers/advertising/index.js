import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import styles from './styles';

// NPM Modules
import { Redirect } from 'react-router-dom';

// Components
/*
import MyAds from './components/MyAds';
import AdvertisingStats from './components/AdvertisingStats';
import SubHeader from '../header/SubHeader';
import theme from '../../theme';
*/
// Redux
// Actions
/*
import { ModalActions } from '../../redux/modals';
import { AdvertisingActions } from '../../redux/advertising';
import { Web3Actions } from '../../redux/web3';
*/

class Advertising extends React.Component {
  state = {
    ads: [],
    lunToUSD: 1,
  };

  /*
  getStats = async (chosenDate) => {
    let { advertisingActions, web3Actions } = this.props;
    var conversion = await web3Actions.getUSDConversion('lunyr');
    advertisingActions.stats(conversion, chosenDate.year, chosenDate.month);
  };

  async componentDidMount() {
    let { advertisingActions, web3Actions, auth } = this.props;
    if (!auth.isLoggedIn) {
      return;
    }
    var offset = 0;
    var json = await advertisingActions.getAllAds(LIMIT, offset);
    var conversion = await web3Actions.getUSDConversion('lunyr');
    var ads = json.ads.rows;
    var today = new Date();
    advertisingActions.stats(conversion, today.getFullYear(), today.getMonth() + 1);
    for (var i = 0; i < ads.length; i++) {
      if (today > new Date(ads[i].startsOn) && today < new Date(ads[i].endsOn)) {
        ads[i].active = 'Active';
      } else if (today < new Date(ads[i].startsOn)) {
        ads[i].active = 'Pending';
      } else {
        ads[i].active = 'Expired';
      }

      ads[i].image = `https://ipfs.io/ipfs/${ads[i].imageHash}`;
      ads[i].spend = '$' + (ads[i].bidValueLUN * conversion).toFixed(2);
      ads[i].cpc =
        ads[i].clicks > 0
          ? '$' + ((ads[i].bidValueLUN * conversion) / ads[i].clicks).toFixed(2)
          : 0;
    }
    this.setState({
      lunToUSD: conversion,
      ads,
    });
  }
  */

  render() {
    const { account, advertising, classes, intl } = this.props;
    const cpc =
      typeof advertising.clicks === 'number' && advertising.clicks > 0
        ? (advertising.cost / advertising.clicks).toFixed(2)
        : advertising.cost;

    const advertisingCards = [
      {
        id: 'reach',
        headerTitle: intl.formatMessage({
          id: 'advertising_reach_header',
          defaultMessage: 'Reach',
        }),
        stat: advertising.reach,
        bodyHeader: intl.formatMessage({
          id: 'advertising_reach_body',
          defaultMessage: 'Total Reach',
        }),
      },
      {
        id: 'cpc',
        headerTitle: intl.formatMessage({
          id: 'advertising_cpc_header',
          defaultMessage: 'Cost per click',
        }),
        stat: `$${cpc}`,
        bodyHeader: intl.formatMessage({
          id: 'advertising_cpc_body',
          defaultMessage: 'Cost per Click',
        }),
      },
      {
        id: 'linkClicks',
        headerTitle: intl.formatMessage({
          id: 'advertising_linkClicks_header',
          defaultMessage: 'Link clicks',
        }),
        stat: advertising.clicks,
        bodyHeader: intl.formatMessage({
          id: 'advertising_linkClicks_body',
          defaultMessage: 'Total Clicks',
        }),
        avgPerDay: (advertising.clicks / 30).toFixed(2),
      },
    ];

    if (!account) {
      return <Redirect to="/login" />;
    }

    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.header__left}>
            <h1 className={classes.header__title}>
              <FormattedMessage id="advertising_title" defaultMessage="Advertise" />
            </h1>
            <p className={classes.header__help}>
              Spread the word out about your products. Create an ad to advertise on the Lunyr
              platform.
            </p>
          </div>
        </div>
        <div className={classes.body}>
          {/*
          {advertisingCards.length > 0 && (
            <AdvertisingStats
              advertisingCards={advertisingCards}
              lunToUSD={this.state.lunToUSD}
              getStats={this.getStats}
            />
          )}
          <MyAds
            ads={this.state.ads}
            createAd={() => this.props.history.push('/advertising/create')}
          />
          */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ advertising, auth: { account }, locale }) => ({
  account,
  advertising,
  locale,
});

const mapDispatchToProps = {};

/*
const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  advertisingActions: bindActionCreators(AdvertisingActions, dispatch),
  web3Actions: bindActionCreators(Web3Actions, dispatch),
});
*/

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Advertising)));
