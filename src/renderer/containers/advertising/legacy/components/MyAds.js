/***
 * My advertisements
 * @patr -- patrick@quantfive.org
 */

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import ReactTable from 'react-table';

// Stylesheets
import 'react-table/react-table.css';
import '../stylesheets/react-table.css';

// Components

class MyAds extends React.Component {
  chooseAd = () => {
    return {
      onClick: (e, handleOriginal) => {
        if (handleOriginal) {
          handleOriginal();
        }
      },
    };
  };

  render() {
    const { intl } = this.props;

    const adHeaders = [
      // Ad photo
      {
        Header: intl.formatMessage({
          id: 'ads_adName',
          defaultMessage: 'Ad Name',
        }),
        accessor: 'image',
        id: 'image',
        className: 'header',
        Cell: props => (
          <img className={css(styles.adImage)} src={props.value} alt={'Advertising'} />
        ),
      },

      // Ad name Header
      {
        accessor: 'title',
        className: 'header',
        id: 'title',
      },

      // Active without a header
      {
        accessor: 'active',
        className: 'header',
        Cell: props => (
          <div
            className={css(
              styles.active,
              props.value === 'Active'
                ? styles.activeAd
                : props.value === 'Expired' ? styles.expiredAd : styles.pendingAd
            )}
          >
            {props.value}
          </div>
        ),
      },

      // Published Header
      {
        Header: intl.formatMessage({
          id: 'ads_adReach',
          defaultMessage: 'Reach',
        }),
        id: 'reach',
        className: 'header',
        accessor: 'reach',

        style: StyleSheet.create({
          style: {
            '@media only screen and (min-width: 1024px)': {
              marginLeft: '180px',
            },

            '@media only screen and (min-width: 1440px)': {
              marginLeft: '281px',
            },
          },
        }),
      },

      // Ending on Header
      {
        Header: intl.formatMessage({
          id: 'ads_adClicks',
          defaultMessage: 'Clicks',
        }),
        id: 'clicks',
        accessor: 'clicks',
        className: 'header',
        style: StyleSheet.create({
          style: {
            '@media only screen and (min-width: 1024px)': {
              marginLeft: '100px',
            },

            '@media only screen and (min-width: 1440px)': {
              marginLeft: '135px',
            },
          },
        }),
      },

      // Bid
      {
        Header: intl.formatMessage({
          id: 'ads_adCPC',
          defaultMessage: 'Cost per click',
        }),
        id: 'cpc',
        className: 'header',
        accessor: 'cpc',
        style: StyleSheet.create({
          style: {
            '@media only screen and (min-width: 1024px)': {
              marginLeft: '115px',
            },
            '@media only screen and (min-width: 1440px)': {
              marginLeft: '115px',
            },
          },
        }),
      },

      // Adshare
      {
        Header: intl.formatMessage({
          id: 'ads_adAmountSpent',
          defaultMessage: 'Amount Spent',
        }),
        id: 'spend',
        className: 'header',
        accessor: 'spend',
        style: StyleSheet.create({
          style: {
            '@media only screen and (min-width: 1024px)': {
              marginLeft: '110px',
            },
            '@media only screen and (min-width: 1440px)': {
              marginLeft: '136px',
            },
          },
        }),
      },
    ];

    return (
      <div className={css(styles.myAds)}>
        <div className={css(styles.header)}>
          <span className={css(styles.myAdsTitle)}>
            <FormattedMessage id="ads_title" defaultMessage="My Ads" />
          </span>
          <button className={css(styles.createAnAd)} onClick={this.props.createAd}>
            <i className={css(styles.bullHorn) + ' fa fa-bullhorn'} aria-hidden="true" />
            <FormattedMessage id="ads_create" defaultMessage="Create an Ad" />
          </button>
        </div>

        <div className={css(styles.ads)}>
          <div className={css(styles.startOfAds)}>
            <ReactTable
              data={this.props.ads}
              columns={adHeaders}
              minRows={0}
              getTdProps={this.chooseAd}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  myAds: {
    background: '#fff',
    borderRadius: '4px',
    fontFamily: 'Roboto',
    width: 'calc(100% - 30px)',
    minHeight: 250,
  },
  header: {
    padding: '25px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
  },
  myAdsTitle: {
    fontSize: '26px',
    fontWeight: '300',
    color: '#3C394C',
  },
  bullHorn: {
    marginRight: '8px',
  },
  createAnAd: {
    marginLeft: 'auto',
    color: '#626DFF',
    fontSize: '14px',
    padding: '10px 8px',
    background: '#fff',
    borderRadius: '4px',
    outline: 'none',
    border: '1px solid #626DFF',
    cursor: 'pointer',
  },
  ads: {
    padding: '15px',
  },

  // Ad line
  adHeaders: {
    display: 'flex',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
    fontWeight: '500',
    color: '#8D8E90',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
  startOfAds: {
    marginTop: '5px',
  },
  ad: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  adImage: {
    height: '50px',
    width: '50px',
    borderRadius: '6px',
    objectFit: 'scale-down',
  },
  adName: {
    marginLeft: '15px',
  },
  active: {
    opacity: '.6',
    width: '60px',
    height: '20px',
    color: '#fff',
    fontSize: '11px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  activeAd: {
    background: '#6DB71D',
  },
  expiredAd: {
    background: '#868C97',
  },
  pendingAd: {
    background: '#EAC234',
  },
  published: {
    marginLeft: '20px',

    '@media only screen and (min-width: 1024px)': {
      marginLeft: '42px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '38px',
    },
  },

  endOn: {
    '@media only screen and (min-width: 1024px)': {
      marginLeft: '90px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '136px',
    },
  },

  bid: {
    '@media only screen and (min-width: 1024px)': {
      marginLeft: '95px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '113px',
    },
  },

  adShare: {
    '@media only screen and (min-width: 1024px)': {
      marginLeft: '83px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '75px',
    },
  },
});

export default injectIntl(MyAds);
