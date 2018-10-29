import React from 'react';
import { FormattedMessage } from 'react-intl';
import injectStyles from 'react-jss';
import cx from 'classnames';

class PreviewAndPublish extends React.Component {
  render() {
    const { classes, conversion, yourBid, yourLunBalance } = this.props;
    const yourBidFee = yourBid * 0.85;
    const yourBidFeeLUN = conversion ? (yourBidFee / conversion).toFixed(5) : '0';
    const yourBidLUN = conversion ? (yourBid / conversion).toFixed(5) : '0';
    const txfee = yourBid * 0.15;
    const yourBidTXFee = conversion ? (txfee / conversion).toFixed(5) : '0';
    return (
      <div className={classes.body}>
        <div className={cx(classes.section, classes.noborder)}>
          <div className={classes.numbers}>
            <div className={classes.headerTitle}>
              <FormattedMessage id="previewandpub_review" defaultMessage="Review" />
            </div>
            <div className={classes.headerNote}>
              <FormattedMessage
                id="previewandpub_note"
                defaultMessage="NOTE: Remember your bid is deducted by 15%, so a $5 bid becomes $4.25"
              />
            </div>
            <div className={classes.bidNumbers}>
              <div className={classes.content}>
                <div className={classes.bidLabel}>
                  <FormattedMessage id="previewandpub_yourBid" defaultMessage="Your Bid" />
                </div>
                <div className={cx(classes.bidNumber, classes.yourBid)}>
                  ${yourBidFee.toFixed(2)}
                </div>
                <div className={classes.usd}>
                  = {yourBidFeeLUN} <span className={classes.lunLabel}>LUN</span>
                </div>
              </div>
              <div className={classes.content}>
                <div className={classes.bidLabel}>
                  <FormattedMessage id="previewandpub_txFee" defaultMessage="Transaction Fee" />
                </div>
                <div className={cx(classes.bidNumber, classes.yourBid)}>${txfee.toFixed(2)}</div>
                <div className={classes.usd}>
                  = {yourBidTXFee} <span className={classes.lunLabel}>LUN</span>
                </div>
              </div>

              <div className={classes.content}>
                <div className={classes.bidLabel}>
                  <FormattedMessage id="previewandpub_totalCost" defaultMessage="Total Cost" />
                </div>
                <div className={cx(classes.bidNumber, classes.yourBid)}>${yourBid.toFixed(2)}</div>
                <div className={classes.usd}>
                  = {yourBidLUN} <span className={classes.lunLabel}>LUN</span>
                </div>
              </div>

              <div className={classes.content}>
                <div className={classes.bidLabel}>
                  <FormattedMessage id="previewandpub_yourBalance" defaultMessage="Your Balance" />
                </div>
                <div className={classes.bidNumber}>${(conversion * yourLunBalance).toFixed(2)}</div>
                <div className={classes.usd}>
                  = {yourLunBalance} <span className={classes.lunLabel}>LUN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  section: {
    borderBottom: '1px solid #eee',
    padding: '12.5px 25px',
    fontFamily: 'Roboto',
    '@media only screen and (min-width: 768px)': {
      padding: '25px 50px',
    },
  },
  noborder: {
    borderBottom: 'none',
  },
  header: {
    marginBottom: '28px',
  },
  advertisingImage: {
    height: '96.48px',
    width: '143.71px',
    objectFit: 'scale-down',
  },
  divider: {
    border: '1px solid #eee',
    margin: '25px 0px',
  },
  profileUpload: {
    display: 'flex',
    justifyContent: 'center',
    border: '1px solid rgba(0, 0, 0, .1)',
    cursor: 'pointer',
    padding: '10px',
  },
  createAnAd: {
    fontSize: '26px',
    fontWeight: '300',
  },
  headerTitle: {
    color: '#354052',
    fontSize: '20px',
  },
  headerNote: {
    color: '#354052',
    opacity: '.6',
    fontSize: '13px',
    marginTop: '5px',
  },
  bidNumbers: {
    marginTop: '20px',
    display: 'flex',
    maxWidth: '900px',
    justifyContent: 'space-between',
    '@media only screen and (max-width: 1024px)': {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  bidLabel: {
    color: '#354052',
    opacity: '.6',
    fontSize: '11px',
    marginBottom: '8px',
  },
  bidNumber: {
    fontSize: '36px',
    color: '#354052',
  },
  lunLabel: {
    fontSize: '15px',
    color: '#BBBBBC',
  },
  usd: {
    color: '#354052',
    opacity: '.6',
  },
});

export default injectStyles(styles)(PreviewAndPublish);
