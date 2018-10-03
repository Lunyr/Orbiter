import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import { FormattedMessage, injectIntl } from 'react-intl';

// Components
import MyAds from './components/MyAds';
import AdvertisingStats from './components/AdvertisingStats';
import SubHeader from '../header/SubHeader';
import theme from '../../theme';

// Redux
// Actions
import { ModalActions } from '../../redux/modals';
import { AdvertisingActions } from '../../redux/advertising';
import { Web3Actions } from '../../redux/web3';

const LIMIT = 12; // the number of ads we get per page

class AdvertisingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ads: [],
      lunToUSD: 1,
    };
  }

  /***
   * Gets the stats for the current chosen month
   * @params {chosenDate} -- an object with year and month
   */
  getStats = async chosenDate => {
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
        ads[i].clicks > 0 ? '$' + (ads[i].bidValueLUN * conversion / ads[i].clicks).toFixed(2) : 0;
    }
    this.setState({
      lunToUSD: conversion,
      ads,
    });
    mixpanel.track('advertising_opened');
  }

  render() {
    const { advertising, auth, intl } = this.props;
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

    if (!auth.isLoggedIn) {
      return <Redirect to="/login" />;
    }

    return (
      <div className={css(styles.advertisingPage)}>
        <SubHeader
          subHeaderTitle={<FormattedMessage id="advertising_title" defaultMessage="Advertise" />}
          location={this.props.match.path}
          headerStyles={styles.headerStyles}
        />

        <div className={css(styles.lower)}>
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
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  advertisingPage: {},
  lower: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing,
    paddingBottom: theme.spacing,
    '@media only screen and (max-width: 768px)': {
      padding: 0,
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
  locale: state.localization.locale,
});

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  advertisingActions: bindActionCreators(AdvertisingActions, dispatch),
  web3Actions: bindActionCreators(Web3Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AdvertisingPage));
