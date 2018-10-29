import { remote } from 'electron';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import ReactTable from 'react-table';
import { FaBullhorn as BullhornIcon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import 'react-table/react-table.css';
import styles from './styles';

class MyAds extends React.Component {
  state = {
    ads: [],
  };

  getAdsInformation = async () => {
    try {
      const { auctioneer } = remote.getGlobal('contracts');
      if (auctioneer) {
        //  Derive the next ad period available
        const currentPeriod = await auctioneer.methods.getCurrentPeriod().call();
        const auctionId = await auctioneer.methods.getAuctionId(1, currentPeriod).call();
        const adsForAuction = await auctioneer.methods.getAdsForAuction(auctionId).call();
        this.setState({
          ads: adsForAuction[1],
          bids: adsForAuction[2],
          bidders: adsForAuction[3],
        });
      }
    } catch (error) {
      console.error(error);
    }
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
        Cell: (props) => <img className={classes.adImage} src={props.value} alt="Advertising" />,
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

  componentDidMount() {
    this.getAdsInformation();
  }

  render() {
    const { classes } = this.props;
    const { ads } = this.state;
    return (
      <div className={classes.myAds}>
        <div className={classes.header}>
          <span className={classes.myAdsTitle}>
            <FormattedMessage id="ads_title" defaultMessage="My Ads" />
          </span>
          <Link to="/advertising/create">
            <button className={classes.createAnAd}>
              <BullhornIcon className={classes.bullHorn} />
              <FormattedMessage id="ads_create" defaultMessage="Create an Ad" />
            </button>
          </Link>
        </div>
        <div className={classes.ads}>
          <div className={classes.startOfAds}>
            <ReactTable data={ads} columns={this.columns()} minRows={10} />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(injectStyles(styles)(MyAds));
