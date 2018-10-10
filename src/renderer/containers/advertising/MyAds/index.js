import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import ReactTable from 'react-table';
import { FaBullhorn as BullhornIcon } from 'react-icons/fa';
import cx from 'classnames';
// import 'react-table/react-table.css';
// import './legacy/stylesheets/react-table.css';
import styles from './styles';

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

  columns = () => {
    const { classes, intl } = this.props;
    return [
      // Ad photo
      {
        Header: intl.formatMessage({
          id: 'ads_adName',
          defaultMessage: 'Ad Name',
        }),
        accessor: 'image',
        id: 'image',
        className: 'header',
        Cell: (props) => <img className={classes.adImage} src={props.value} alt={'Advertising'} />,
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
        Cell: (props) => (
          <div
            className={cx(
              classes.active,
              props.value === 'Active'
                ? classes.activeAd
                : props.value === 'Expired'
                  ? classes.expiredAd
                  : classes.pendingAd
            )}>
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
      },
    ];
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.myAds}>
        <div className={classes.header}>
          <span className={classes.myAdsTitle}>
            <FormattedMessage id="ads_title" defaultMessage="My Ads" />
          </span>
          <button className={classes.createAnAd} onClick={this.props.createAd}>
            <BullhornIcon className={classes.bullHorn} />
            <FormattedMessage id="ads_create" defaultMessage="Create an Ad" />
          </button>
        </div>
        <div className={classes.ads}>
          <div className={classes.startOfAds}>
            <ReactTable
              data={this.props.ads}
              columns={this.columns()}
              minRows={0}
              getTdProps={this.chooseAd}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(injectStyles(styles)(MyAds));
