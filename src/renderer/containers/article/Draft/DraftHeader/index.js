import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import multihashes from 'multihashes';
import ipfsAPI from 'ipfs-api';
import { toast } from 'react-toastify';
import get from 'lodash/get';
import { readUploadedFileAsBuffer } from '../../../../../shared/utils';
import { publishProposal } from '../../../../../shared/redux/modules/chain/actions';
import { privToAddress } from '../../../../../lib/accounts';
import { Button, ButtonGroup, Link, MinimumFader, Modal } from '../../../../components';
import BlockchainSubmission from '../../../chain/BlockchainSubmission/';
import styles from './styles';

class DraftHeader extends React.PureComponent {
  state = {
    openedPublishModal: false,
  };

  toastId = null;

  ipfs = ipfsAPI('ipfs.infura.io', 5001, { protocol: 'https' });

  canSubmitDraft = () => {
    return true;
  };

  openPublishModal = () => {
    this.setState({ openedPublishModal: true });
  };

  closePublishModal = () => {
    this.setState({ openedPublishModal: false });
  };

  publishDraft = () => {
    this.openPublishModal();
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

  submit = async (privKey, gasPrice) => {
    const { draft, publishProposal } = this.props;
    const address = privToAddress(privKey);

    const data = {
      ...draft,
      lang: 'en',
      authors: address,
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
      'Publish submitted! You will receive a notification about the transaction shortly.'
    );

    // Send off proposal with response id so we can notify the user of updates
    publishProposal(
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

  componentDidUpdate({ error, transaction }) {
    const { classes } = this.props;
    if (this.props.transaction !== transaction && this.props.transaction) {
      toast.info(
        () => (
          <div className={classes.etherscan}>
            <span>Transaction Hash - {get(this.props.transaction, 'transactionHash')}</span>
            <a
              className={classes.etherscan__link}
              href={`https://etherscan.io/tx/${this.props.transaction.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer">
              View on Etherscan
            </a>
          </div>
        ),
        {
          autoClose: false,
          className: classes.toast__hash,
        }
      );
    }

    if (this.props.error !== error && this.props.error) {
      toast.error(`There was an error publishing! Error: ${error.message}`, {
        autoClose: false,
      });
    }
  }

  render() {
    const { openedPublishModal } = this.state;
    const { classes, intl, isSavingDraft, uuid } = this.props;
    const canSubmit = this.canSubmitDraft();
    return (
      <React.Fragment>
        <ButtonGroup>
          <Link to="/drafts">
            <Button className={classes.cancel} theme="text" type="button" value="Cancel" />
          </Link>
          <Button
            disabled={isSavingDraft || !canSubmit}
            theme="success"
            onClick={this.publishDraft}
            tooltip={!canSubmit ? 'Title and body text are required.' : ''}
            value={intl.formatMessage({
              id: 'editorbar_publish',
              defaultMessage: 'Publish',
            })}
          />
          <MinimumFader ms={1000} show={isSavingDraft}>
            <p className={classes.saved}>Saved!</p>
          </MinimumFader>
        </ButtonGroup>
        <div className={classes.info}>
          <div className={classes.info__stacked}>
            <h1 className={classes.uuid}>
              <span className={classes.info__label}>Draft</span> {uuid}
            </h1>
          </div>
        </div>
        <Modal isOpen={openedPublishModal} onRequestClose={this.closePublishModal}>
          <BlockchainSubmission
            onClose={this.closePublishModal}
            onSubmit={this.submit}
            title={<FormattedMessage id="blockchain_publish" defaultMessage="Publish an Article" />}
            type="publish-article"
          />
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (
  {
    article: {
      draft: { data: draft, loading: isLoadingDraft, saving: isSavingDraft },
    },
    chain: {
      transaction: { error, processing, data, responseId },
    },
  },
  {
    match: {
      params: { uuid },
    },
  }
) => {
  return {
    draft: draft || {},
    transaction: data,
    error,
    isSavingDraft,
    isLoadingDraft,
    processing,
    responseId,
    uuid,
  };
};

export default connect(
  mapStateToProps,
  { publishProposal }
)(injectIntl(injectStyles(styles)(DraftHeader)));
