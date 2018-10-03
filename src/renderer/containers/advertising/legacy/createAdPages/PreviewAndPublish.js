/***
 * Page 4 of ad modal -- Preview and Publish
 * @patr -- patrick@quantfive.org
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';

class PreviewAndPublish extends React.Component {
  render() {
    const yourBidFee = this.props.yourBid * 0.85;
    const yourBidFeeLUN = this.props.conversion
      ? (yourBidFee / this.props.conversion).toFixed(5)
      : '0';
    const yourBidLUN = this.props.conversion
      ? (this.props.yourBid / this.props.conversion).toFixed(5)
      : '0';
    const txfee = this.props.yourBid * 0.15;
    const yourBidTXFee = this.props.conversion ? (txfee / this.props.conversion).toFixed(5) : '0';
    return (
      <div className={css(styles.body)}>
        <div className={css(styles.section, styles.noborder)}>
          <div className={css(styles.numbers)}>
            <div className={css(styles.headerTitle)}>
              <FormattedMessage id="previewandpub_review" defaultMessage="Review" />
            </div>
            <div className={css(styles.headerNote)}>
              <FormattedMessage
                id="previewandpub_note"
                defaultMessage="NOTE: Remember your bid is deducted by 15%, so a $5 bid becomes $4.25"
              />
            </div>
            <div className={css(styles.bidNumbers)}>
              <div className={css(styles.content)}>
                <div className={css(styles.bidLabel)}>
                  <FormattedMessage id="previewandpub_yourBid" defaultMessage="Your Bid" />
                </div>
                <div className={css(styles.bidNumber, styles.yourBid)}>
                  ${yourBidFee.toFixed(2)}
                </div>
                <div className={css(styles.usd)}>
                  = {yourBidFeeLUN} <span className={css(styles.lunLabel)}>LUN</span>
                </div>
              </div>
              <div className={css(styles.content)}>
                <div className={css(styles.bidLabel)}>
                  <FormattedMessage id="previewandpub_txFee" defaultMessage="Transaction Fee" />
                </div>
                <div className={css(styles.bidNumber, styles.yourBid)}>${txfee.toFixed(2)}</div>
                <div className={css(styles.usd)}>
                  = {yourBidTXFee} <span className={css(styles.lunLabel)}>LUN</span>
                </div>
              </div>

              <div className={css(styles.content)}>
                <div className={css(styles.bidLabel)}>
                  <FormattedMessage id="previewandpub_totalCost" defaultMessage="Total Cost" />
                </div>
                <div className={css(styles.bidNumber, styles.yourBid)}>
                  ${this.props.yourBid.toFixed(2)}
                </div>
                <div className={css(styles.usd)}>
                  = {yourBidLUN} <span className={css(styles.lunLabel)}>LUN</span>
                </div>
              </div>

              <div className={css(styles.content)}>
                <div className={css(styles.bidLabel)}>
                  <FormattedMessage id="previewandpub_yourBalance" defaultMessage="Your Balance" />
                </div>
                <div className={css(styles.bidNumber)}>
                  ${(this.props.conversion * this.props.yourLunBalance).toFixed(2)}
                </div>
                <div className={css(styles.usd)}>
                  = {this.props.yourLunBalance} <span className={css(styles.lunLabel)}>LUN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
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

export default PreviewAndPublish;
