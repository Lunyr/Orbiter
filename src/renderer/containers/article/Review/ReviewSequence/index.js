import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import cx from 'classnames';
import multihashes from 'multihashes';
import {
  MdCheckCircle as CheckCircleIcon,
  MdError as ErrorCircleIcon,
  MdRateReview as ReviewIcon,
  MdWarning as WarningIcon,
} from 'react-icons/md';
import styles from './styles';

// Components
/*
import GasModal from '../modals/GasModal/';
import CompletedTransaction from '../components/CompletedTransaction';

// Actions
import { ReviewActions } from '../../redux/reviews';
import { Web3Actions } from '../../redux/web3';
import { IPFSActions } from '../../redux/ipfs';
import { ModalActions } from '../../redux/modals';
import { NotificationActions } from '../../redux/notification';

import theme from '../../theme';
*/

const GAS_AMT = 1e6;

const CompletedTransaction = () => <div>Completed tx</div>;

class ReviewSequence extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: [],
      error: '',
      option_chosen: false,
      txhash: '',
      txComplete: false,
      reject_chosen: false,
      acceptance: false,
      page: 'review',
      thoughts: '',
    };
  }

  /*
  componentWillReceiveProps(nextProps) {
    let { notification } = this.props;
    // if we didn't have latestrawTx or latestSignedTx on the push, update them here.
    if (nextProps.notification.latestTxHash && !notification.latestTxHash) {
      nextProps.notificationActions.updateTransaction({
        tx: nextProps.notification.latestRawTx,
        signedTx: nextProps.notification.latestSignedTx,
        txHash: nextProps.notification.latestTxHash,
      });
    }
  }
  */

  /***
   * Function for the gas modal to send the vote to the blockchain
   */
  /*
  sendTransaction = async (options, gasPrice, recursiveNonce = 0) => {
    try {
      const {
        web3,
        article,
        auth,
        modalActions,
        notificationActions,
        contracts,
        notification,
        ipfsActions,
      } = this.props;
      
      const { checked, thoughts } = this.state;
      const acceptance = this.state.acceptance;
      const proposalId = article.proposalID;
      
      let checklist = {};
      for (let i = 0; i < options.length; i++) {
        checklist[options[i]] = checked.indexOf(options[i]) > -1 ? true : false;
      }
      
      // Upload the review to ipfs
      const review = {
        proposalId,
        acceptance,
        checklist,
        thoughts,
        notes: thoughts,
      };
      
      const json = new Blob([JSON.stringify(review)], { type: 'application/json' });
      const hash = await ipfsActions.ipfsAPI(json);
      const buf = multihashes.fromB58String(hash).slice(2);
      const ipfsHash = '0x' + buf.toString('hex');
      const fromAddr = auth.account.profile.ethereumAddress;
      
      // Establish a nonce based on latest transaction
      let nonce;
      
      // Retrieve last transaction hash to verify the user can perform another transaction
      const lastTxHash = await notificationActions.getLatestTx(auth.account.ethereumAddress);
      
      if (lastTxHash) {
        const tx = web3.web3HTTP.eth.getTransaction(lastTxHash);
        const txCount = web3.web3HTTP.eth.getTransactionCount(fromAddr, 'pending');
        if (txCount === 0) {
          nonce = 0;
        } else if (tx) {
          nonce = txCount > tx.nonce + 1 ? txCount : tx.nonce + 1;
        } else {
          nonce = txCount;
        }
      } else {
        nonce = web3.web3HTTP.eth.getTransactionCount(fromAddr, 'pending');
      }
      
      let txhash;
      if (contracts.PeerReview) {
        txhash = await contracts.PeerReview.vote.sendTransaction(proposalId, acceptance, ipfsHash, {
          from: fromAddr,
          gas: GAS_AMT,
          gasPrice,
          nonce,
        });
      } else {
        throw new Error(
          "We're not connected to the blockchain. Please refresh your page and try again!"
        );
      }
      
      this.setState({
        txhash: txhash,
        txComplete: true,
      });
      modalActions.openGasModal(false);
      
      notificationActions.watchTransaction(
        txhash,
        fromAddr,
        auth.account.username,
        'vote',
        article.title,
        article.id,
        notification.latestRawTx,
        notification.latestSignedTx
      );
      
      console.log('TX RESP', txhash);
      return txhash;
    } catch (err) {
      console.log(err);
      Raven.captureException(err);
      this.props.setTransactionFailed(true, () => null);
      return err;
    }
  };
  */
  /***
   * Accepts the article and opens the modal for payment
   */
  /*
  acceptArticle = () => {
    let { auth } = this.props;
    if (!auth.isLoggedIn) {
      this.props.history.push('/login');
    } else {
      this.setState({
        acceptance: true,
      });
      this.props.modalActions.openGasModal(true);
      this.reportStats(true);
    }
  };
  */
  /***
   * Function to report stats to GA
   * @params bool accepted -- whether the article was accepted or rejected
   */
  /*
  reportStats = accepted => {
    let { auth } = this.props;
    try {
      var body = document.body,
        html = document.documentElement;
      
      var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      ReactGA.event({
        category: 'Peer Review Analytics',
        action: 'Time Spent on peer review',
        value: this.totalMilliSeconds,
        label: `Article: ${this.props.title}, User: ${
          auth.account.ethereumAddress
          }, Accepted: ${accepted}`,
      });
      
      ReactGA.event({
        category: 'Peer Review Analytics',
        action: 'Amount Scrolled Downward on Article',
        value: this.downwardScroll,
        label: `Article: ${this.props.title}, User: ${
          auth.account.ethereumAddress
          }, Full Height: ${height}, Accepted: ${accepted}`,
      });
      
      ReactGA.event({
        category: 'Peer Review Analytics',
        action: 'Amount scrolled upward on Article',
        upwardScrollValue: this.upwardScroll,
        label: `Article: ${this.props.title}, User: ${
          auth.account.ethereumAddress
          }, Full Height: ${height}, Accepted: ${accepted}`,
      });
    } catch (err) {
      console.log(err);
      Raven.captureException(err);
    }
  };
  */

  /***
   * Change the text for thoughts
   */
  /*
  changeThoughts = e => {
    this.setState({
      thoughts: e.target.value,
    });
  };
  */
  /***
   * Rejects the article and pushes to login if not logged in
   */
  /*
  rejectArticle = () => {
    let { auth } = this.props;
    if (!auth.isLoggedIn) {
      this.props.history.push('/login');
    } else {
      this.setState({
        option_chosen: true,
        page: 'rejected',
      });
      
      this.reportStats(false);
    }
  };
  */
  /*
  handleSelection = (id, e) => {
    const isChecked = e.target.checked;
    this.setState(({ checked }) => {
      let newChecked = [...checked];
      if (isChecked) {
        newChecked.push(id);
      } else {
        newChecked = [
          ...newChecked.slice(0, newChecked.indexOf(id)),
          ...newChecked.slice(newChecked.indexOf(id) + 1),
        ];
      }
      return {
        checked: newChecked,
        error: '',
      };
    });
  };
  */

  /**
   * Cancel reject screen and return to review.
   */
  /*
  cancelReject = () => {
    this.setState({ page: 'review' });
  };
  */

  /*
  handleReviewSubmission = () => {
    this.setState({
      acceptance: false,
    });
    this.props.modalActions.openGasModal(true);
  };
  */

  renderVoteCasted() {
    const { classes } = this.props;
    return (
      <div className={classes.voteStatus}>
        <CheckCircleIcon className={classes.checkMark} size={60} />
        <p className={classes.voteStatus__header}>
          <FormattedMessage id="review_gotVote" defaultMessage="We've got your vote!" />
        </p>
        <p className={classes.voteStatus__help}>
          <FormattedMessage
            id="review_txProcessed"
            defaultMessage="Your transaction is being processed by the blockchain. Check the status of your transaction on the"
          />
          <Link to="/transactions">
            <FormattedMessage id="review_txLink" defaultMessage="transactions page" />
          </Link>.
        </p>
      </div>
    );
  }

  renderBlacklist() {
    const { classes } = this.props;
    return (
      <div className={classes.voteStatus}>
        <ErrorCircleIcon className={classes.errorMark} size={60} />
        <p className={classes.voteStatus__header}>
          <FormattedMessage id="review_blacklisted" defaultMessage="Your account is blacklisted!" />
        </p>
        <p className={classes.voteStatus__help}>
          <FormattedMessage
            id="review_blacklisted_error"
            defaultMessage="If you believe this is in error, please contact our customer support."
          />
        </p>
      </div>
    );
  }

  renderNotEnoughRewards({ context: { hnr, cbn } }) {
    const { classes } = this.props;
    return (
      <div className={classes.voteStatus}>
        <ErrorCircleIcon className={classes.errorMark} size={60} />
        <p className={classes.voteStatus__header}>
          <FormattedMessage
            id="review_ineligible"
            defaultMessage="Your account is ineligible to vote!"
          />
        </p>
        <div className={classes.voteStatus__help}>
          <p>{`You have ${hnr.user} HP, to vote you must have at least ${hnr.minimum}`}</p>
          <p>{`You have ${cbn.user} CP, to vote you must have at least ${cbn.minimum}`}</p>
        </div>
      </div>
    );
  }

  renderAlreadyFinishedVoting() {
    const { article, classes, intl } = this.props;
    const wasRejected = article.state === 2;
    return (
      <div className={classes.voteStatus}>
        <CheckCircleIcon className={classes.checkMark} size={60} />
        <p className={classes.voteStatus__header}>
          <FormattedMessage id="review_concluded" defaultMessage="Voting has concluded!" />
        </p>
        <p>
          <FormattedMessage id="review_concluded_help" defaultMessage="The review was" />
          <span className={cx(classes.reviewStatus, wasRejected && classes.rejected)}>
            {wasRejected
              ? intl.formatMessage({ id: 'review_concluded_rejected', defaultMessage: 'Rejected' })
              : intl.formatMessage({ id: 'review_concluded_accepted', defaultMessage: 'Accepted' })}
          </span>
        </p>
      </div>
    );
  }

  renderIneligibleVoteReason(reason) {
    if (reason) {
      switch (reason.type) {
        case 'already-voted':
          return this.renderVoteCasted();

        case 'not-in-review':
          return this.renderAlreadyFinishedVoting();

        case 'blacklist':
          return this.renderBlacklist();

        case 'low-rewards':
          return this.renderNotEnoughRewards(reason);

        default:
          return null;
      }
    }
  }

  optionIntlId = (option) => {
    return `review_option_${option.replace(/\s/g, '_').toLowerCase()}`;
  };

  render() {
    const { classes, eligibility = {}, intl } = this.props;
    const { checked, error, txComplete } = this.state;
    const options = [
      'Biased',
      'Copyrighted',
      'Malicious or spam',
      'Not cited',
      'Inappropriate content',
      'Inaccurate information',
      'Incorrect Language',
    ];
    const reviewOptions = options.map((option) => ({
      id: option,
      label: intl.formatMessage({ id: this.optionIntlId(option), defaultMessage: option }),
    }));
    const { canReview, reason } = eligibility;
    return (
      <div className={cx(classes.reviewSequence, txComplete && classes.centered)}>
        {!canReview ? (
          this.renderIneligibleVoteReason(reason)
        ) : txComplete ? (
          <CompletedTransaction txHash={this.state.txhash} review={true} />
        ) : (
          <div>
            <ReviewIcon className={classes.reviewIcon} size={40} />
            <h2 className={classes.reviewSequence__title}>
              <FormattedMessage id="review_content" defaultMessage="Review Content" />
            </h2>
            <div className={classes.reviewSequence__help}>
              {this.state.page === 'review' ? (
                <Fragment>
                  <div className={classes.criteriaContainer}>
                    <FormattedMessage
                      id="review_content_help"
                      defaultMessage="Please judge whether this content meets Lunyr's article guidelines and should be accepted into the community. Check any boxes that describe the content."
                    />
                  </div>
                  <form className={classes.reviewSequence__form}>
                    {error && <p className={classes.form__error}>{error}</p>}
                    <div className={classes.rejectOptions}>
                      {reviewOptions.map(({ id, label }) => {
                        const isChecked = checked.indexOf(id) > -1;
                        return (
                          <div key={id} className={classes.form__group}>
                            <input
                              id={id}
                              className="circle-checkbox"
                              onChange={this.handleSelection.bind(this, id)}
                              type="checkbox"
                              checked={isChecked}
                            />
                            <label
                              htmlFor={id}
                              className={cx(classes.form__label, isChecked && classes.checked)}>
                              {label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </form>
                  <div className={classes.form__actions}>
                    <button
                      disabled={!contracts.PeerReview || checked.length}
                      className={cx(
                        classes.action__accept,
                        checked.length && classes.action__disabled
                      )}
                      // onClick={this.acceptArticle}
                      title={intl.formatMessage({
                        id: 'review_accept',
                        defaultMessage: 'Accept',
                      })}>
                      <FormattedMessage id="review_accept" defaultMessage="Accept" />
                    </button>
                    <button
                      disabled={!contracts.PeerReview || !checked.length}
                      className={cx(
                        classes.action__reject,
                        classes.prominent,
                        !checked.length && classes.action__disabled
                      )}
                      // onClick={this.rejectArticle}
                      title={intl.formatMessage({
                        id: 'review_reject',
                        defaultMessage: 'Reject',
                      })}>
                      <FormattedMessage id="review_reject" defaultMessage="Reject" />
                    </button>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className={classes.criteriaContainer}>
                    <FormattedMessage
                      id="review_suggestion"
                      defaultMessage="What would you suggest to the writer to improve the submission?"
                    />
                  </div>
                  <div>
                    <textarea
                      //onChange={this.changeThoughts}
                      placeholder={intl.formatMessage({
                        id: 'review_startWritingHere',
                        defaultMessage: 'Start writing here',
                      })}
                      className={classes.feedback}
                      value={this.state.thoughts}
                    />
                    <div className={classes.form__actions}>
                      <button
                        type="button"
                        // onClick={this.cancelReject}
                        className={classes.action__back}
                        title={intl.formatMessage({
                          id: 'review_back',
                          defaultMessage: 'Back',
                        })}>
                        <FormattedMessage id="review_back" defaultMessage="Back" />
                      </button>
                      <button
                        className={cx(classes.action__reject, classes.prominent)}
                        // onClick={this.handleReviewSubmission}
                        title={intl.formatMessage({
                          id: 'review_reject',
                          defaultMessage: 'Reject',
                        })}>
                        <FormattedMessage id="review_reject" defaultMessage="Reject" />
                      </button>
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
            {/*
              <GasModal
              sendTransaction={this.sendTransaction.bind(this, options)}
              gasAmt={GAS_AMT}
              actionMessage={intl.formatMessage({
                id: 'review_gasAction',
                defaultMessage: 'vote on this article',
              })}
              type="peer-review"
            />
               */}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {};

export default injectIntl(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(injectStyles(styles)(ReviewSequence))
  )
);
