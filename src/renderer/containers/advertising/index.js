import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';
import MyAds from './MyAds';
import styles from './styles';

// Components
/*

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
  /*

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

    if (!account) {
      return <Redirect to="/login" />;
    }

    console.log('advertising', this.props);

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
          <MyAds />
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

export default connect(
  mapStateToProps,
  null
)(injectIntl(injectStyles(styles)(Advertising)));
