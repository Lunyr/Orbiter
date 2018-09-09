import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { editorStateFromRaw } from 'megadraft';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import cx from 'classnames';
import multihashes from 'multihashes';
import ipfsAPI from 'ipfs-api';
import { languageToReadable } from '../../../../shared/redux/modules/locale/actions';
import {
  fetchArticleProposal,
  fetchVotingEligibility,
} from '../../../../shared/redux/modules/article/review/actions';
import { voteOnProposal } from '../../../../shared/redux/modules/chain/actions';
import { privToAddress } from '../../../../lib/accounts';
import decorator from '../../../components/MegadraftEditor/decorator';
import { readUploadedFileAsBuffer } from '../../../../shared/utils';
import {
  Contributors,
  ErrorBoundary,
  Hero,
  Label,
  InstantLoadingIndicator,
  MegadraftEditor,
  Modal,
} from '../../../components';
import BlockchainSubmission from '../../chain/BlockchainSubmission/';
import References from '../references/References';
import ReviewSideSequence from './ReviewSideSequence';
import styles from './styles';
import { calculateDiff } from './diffUtils';

class Review extends React.Component {
  state = {
    openedVoteModal: false,
    vote: null,
  };

  toastId = null;

  ipfs = ipfsAPI('ipfs.infura.io', 5001, { protocol: 'https' });

  openVoteModal = () => {
    this.setState({ openedVoteModal: true });
  };

  closeVoteModal = () => {
    this.setState({ openedVoteModal: false });
  };

  onVote = (vote) => {
    this.setState({ vote }, this.openVoteModal);
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

  submitVote = async (privKey, gasPrice) => {
    const {
      vote: { accepted, checked },
    } = this.state;
    const { proposalParam, voteOnProposal } = this.props;
    const proposalId = parseInt(proposalParam, 10);
    const address = privToAddress(privKey);

    // Upload file hash
    const qmHash = await this.handleIPFSUpload(
      new window.Blob([JSON.stringify(checked)], { type: 'application/json' })
    );

    if (!qmHash || qmHash === `QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH`) {
      return new Error('IPFS error');
    }

    const ipfsHash = `0x${multihashes.toHexString(multihashes.fromB58String(qmHash)).slice(4)}`;

    const responseId = toast.success(
      'Vote submitted! You will receive a notification about the transaction shortly.'
    );

    // Send off proposal with response id so we can notify the user of updates
    voteOnProposal(
      responseId,
      {
        proposalId,
        accepted,
        ipfsHash,
      },
      {
        from: address,
        gas: 5e5,
        gasPrice,
      },
      privKey
    );
  };

  loadReview = (proposalParam) => {
    const { account, fetchArticleProposal, fetchVotingEligibility } = this.props;
    const proposalId = parseInt(proposalParam, 10);
    fetchArticleProposal(proposalId);
    if (account) {
      fetchVotingEligibility(proposalId, account);
    }
  };

  componentDidUpdate({ transactionError, transaction }) {
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

    if (this.props.transactionError !== transactionError && this.props.transactionError) {
      toast.error(`There was an error publishing! Error: ${transactionError.message}`, {
        autoClose: false,
      });
    }
  }

  render() {
    const { openedVoteModal } = this.state;
    const {
      account,
      article,
      classes,
      diff,
      eligibility,
      intl,
      isFetching,
      isAuthor,
      proposalParam,
    } = this.props;
    const { contributors, title, heroImageHash, lang, oldArticle } = article;
    const references = [];
    return (
      <ErrorBoundary
        errorMsg={intl.formatMessage({
          id: 'reader_error',
          defaultMessage:
            "Oh no, something went wrong! It's okay though, please refresh and your content should return.",
        })}>
        <InstantLoadingIndicator
          className={classes.container}
          diff={proposalParam}
          watch={isFetching}
          load={this.loadReview}>
          <Label
            className={classes.reviewLabel}
            type="accent"
            valueClassName={classes.reviewLabel__value}
            value="Article Proposal"
          />
          <section className={classes.article}>
            <header className={classes.header}>
              <Hero imageHash={heroImageHash} />
            </header>
            <div className={classes.main}>
              <div className={classes.title__container}>
                <h1 className={classes.title}>{title}</h1>
              </div>
              <div
                className={cx(
                  classes.langChange,
                  oldArticle && oldArticle.lang ? classes.langChanged : classes.langAdded
                )}>
                {oldArticle && oldArticle.lang
                  ? `Language: ${languageToReadable[oldArticle.lang]} --> ${
                      languageToReadable[lang]
                    }`
                  : `+Language: ${languageToReadable[lang] || 'English'}`}
              </div>
              <div className={classes.contributors}>
                <Contributors
                  contributors={contributors}
                  tagLine={
                    contributors && contributors.length > 1 ? (
                      <FormattedMessage id="contributors_title" defaultMessage="Contributors" />
                    ) : (
                      <FormattedMessage id="review_contributors_title" defaultMessage="Author" />
                    )
                  }
                />
              </div>
              <div className={classes.editor}>
                <MegadraftEditor editorState={diff} readOnly={true} />
              </div>
              <footer className={classes.footer}>
                <References formatType="MLA" references={references} />
              </footer>
            </div>
          </section>
          <aside className={classes.aside}>
            <ReviewSideSequence
              account={account}
              article={article}
              eligibility={eligibility}
              isAuthor={isAuthor}
              onSubmit={this.onVote}
            />
          </aside>
          <Modal isOpen={openedVoteModal} onRequestClose={this.closeVoteModal}>
            <BlockchainSubmission
              onClose={this.closeVoteModal}
              onSubmit={this.submitVote}
              title={<FormattedMessage id="blockchain_vote" defaultMessage="Vote on Proposal" />}
              type="publish-article"
            />
          </Modal>
        </InstantLoadingIndicator>
      </ErrorBoundary>
    );
  }
}

const performDiff = (article) => {
  if (!article) {
    // Return no diff
    return null;
  } else if (!article.oldArticle || !article.oldArticle.megadraft) {
    // Return original article
    return JSON.parse(article.megadraft);
  } else {
    const { megadraft, oldArticle } = article;
    const newDraftMegadraft = JSON.parse(megadraft);
    const newDraftEditorState = editorStateFromRaw(newDraftMegadraft, decorator);
    const oldArticleMegadraft = JSON.parse(oldArticle.megadraft);
    const oldArticleEditorState = editorStateFromRaw(oldArticleMegadraft, decorator);
    const diff = calculateDiff(
      oldArticleEditorState,
      newDraftEditorState,
      oldArticleMegadraft,
      newDraftMegadraft
    );
    // Need to explicitly return null for an empty diff so that
    // it doesnt blow up the Megadraft editor which freaks out about `{}`
    return !isEmpty(diff) ? diff : null;
  }
};

const mapStateToProps = (
  {
    auth: { account },
    article: {
      review: { error, data, isFetching, eligibility },
    },
    chain: {
      transaction: { error: transactionError, processing, data: transaction, responseId },
    },
  },
  {
    match: {
      params: { proposalId: proposalParam, title: titleParam },
    },
  }
) => ({
  account,
  article: data || {},
  diff: performDiff(data),
  eligibility,
  error,
  isFetching,
  isAuthor: data && data.fromAddress === account,
  proposalParam,
  titleParam,
  transaction,
  transactionError,
  processing,
  responseId,
});

const mapDispatchToProps = {
  fetchArticleProposal,
  fetchVotingEligibility,
  voteOnProposal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Review)));
