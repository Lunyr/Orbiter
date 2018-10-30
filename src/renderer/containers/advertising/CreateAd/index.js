import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import multihashes from 'multihashes';
import ipfsAPI from 'ipfs-api';
import { createAd } from '../../../../shared/redux/modules/chain/actions';
import { privToAddress } from '../../../../lib/accounts';
import { Button, ErrorBoundary, Modal } from '../../../components';
import BlockchainSubmission from '../../chain/BlockchainSubmission/';
import CreateAdForm from './CreateAdForm';
import AdDuration from './AdDuration';
import AdFrequency from './AdFrequency';
import PreviewAndPublish from './PreviewAndPublish';
import styles from './styles';
import { readUploadedFileAsBuffer } from '../../../../shared/utils';

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
    yourBidLun: 0,
    nextAdPeriod: null,
    startTime: null,
    openedCreateAdModal: false,
  };

  ipfs = ipfsAPI('ipfs.infura.io', 5001, { protocol: 'https' });

  toastId = null;

  handleFormChange = (key, value) => {
    this.setState({ [key]: value });
  };

  saveToIpfs = (arrayBuffer) => {
    const buffer = Buffer.from(arrayBuffer);
    return this.ipfs.add(buffer);
  };

  handleIPFSUpload = async (file) => {
    try {
      // Extract out file as text
      const arrayBuffer = await readUploadedFileAsBuffer(file);
      // Save it to ipfs
      const [{ hash }] = await this.saveToIpfs(arrayBuffer);
      // Return hash as a reference
      return hash;
    } catch (err) {
      console.warn(err.message);
    }
  };

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

  closeAdModal = () => {
    this.setState({ openedCreateAdModal: false });
  };

  submitAd = async (privKey, gasPrice) => {
    const { createAd } = this.props;
    const address = privToAddress(privKey);

    const {
      adPeriodInDays,
      title,
      callToAction: actionLabel,
      body,
      url,
      startsOn,
      endsOn,
      yourBid: bidValueDollars,
      yourBidLun: bidValueLUN,
      imageHash,
      startTime,
    } = this.state;

    const data = {
      adPeriodInDays,
      title,
      actionLabel,
      startsOn,
      endsOn,
      body,
      url,
      bidValueLUN,
      bidValueDollars,
      imageHash,
      startTime,
    };

    // Upload file hash
    const qmHash = await this.handleIPFSUpload(
      new window.Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    if (!qmHash || qmHash === `QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH`) {
      return new Error('IPFS error');
    }

    const ipfsHash = `0x${multihashes.toHexString(multihashes.fromB58String(qmHash)).slice(4)}`;
    const responseId = toast.success(
      'Create ad submitted! You will receive a notification about the transaction shortly.'
    );

    // Send off proposal with response id so we can notify the user of updates
    createAd(
      responseId,
      ipfsHash,
      {
        from: address,
        gas: 5e5,
        gasPrice,
      },
      privKey
    );
  };

  submit = (e) => {
    e.preventDefault();
    this.setState({ openedCreateAdModal: true });
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
    const { address, balances, conversion, rewards, classes, intl } = this.props;
    const {
      adPeriodInDays,
      openedCreateAdModal,
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
      <ErrorBoundary
        errorMsg={intl.formatMessage({
          id: 'reader_error',
          defaultMessage:
            "Oh no, something went wrong! It's okay though, please refresh and your content should return.",
        })}>
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
                    title={
                      !canSubmit
                        ? 'Fill out all required fields to submit ad.'
                        : 'Create advertisement'
                    }
                    theme="primary"
                    value="Create Advertisement"
                    disabled={!canSubmit}
                  />
                </div>
              </form>
            )}
          </div>
          <Modal isOpen={openedCreateAdModal} onRequestClose={this.closeAdModal}>
            <BlockchainSubmission
              onClose={this.closeAdModal}
              onSubmit={this.submitAd}
              title={<FormattedMessage id="blockchain_ad" defaultMessage="Create Advertisement" />}
              type="create-ad"
            />
          </Modal>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ wallet: { address, balances, conversion, rewards } }) => ({
  address,
  balances,
  conversion,
  rewards,
});

const mapDispatchToProps = {
  createAd,
};

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectStyles(styles)(CreateAd))
);
