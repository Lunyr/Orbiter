import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import Sticky from 'react-stickynode';
import cx from 'classnames';
import { LoadingIndicator } from '../../../components';
import ReviewSequence from './ReviewSequence/';

const parseIntWithRadix = (value) => parseInt(value, 10);

class ReviewSideSequence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckingReviewable: true,
      isEligibleToVote: false,
      reason: {},
      transactionFailed: false,
    };
  }

  reasonForIneligbleVote = async (contracts, proposalId, voter) => {
    const { Contributors, Environment } = contracts;
    const userHNR = await Contributors.getHNR(voter).then(parseIntWithRadix);
    const hnrVoteThreshold = await Environment.getValue('hnrVoteThreshold').then(parseIntWithRadix);
    const userCBN = await Contributors.getCBN(voter).then(parseIntWithRadix);
    const cbnVoteThreshold = await Environment.getValue('cbnVoteThreshold').then(parseIntWithRadix);
    const isBlackListed = await Environment.getBlacklist(voter);
    if (userHNR < hnrVoteThreshold || userCBN < cbnVoteThreshold) {
      return {
        type: 'low-rewards',
        context: {
          hnr: {
            user: userHNR,
            minimum: hnrVoteThreshold,
          },
          cbn: {
            user: userCBN,
            minimum: cbnVoteThreshold,
          },
        },
      };
    } else if (isBlackListed) {
      return {
        type: 'blacklist',
      };
    }
    return {
      type: 'already-voted',
    };
  };

  determineReviewState = async (props) => {
    const { auth, article, articleActions, contracts } = props;
    const isInReview = article.state === 1;
    // This article in question is no longer in review status, don't allow for any actions
    if (!isInReview) {
      return {
        isCheckingReviewable: false,
        isEligibleToVote: false,
        reason: {
          type: 'not-in-review',
        },
      };
    } else {
      // If not logged in but article needs reviews show user login link
      if (!auth.isLoggedIn) {
        return {
          isCheckingReviewable: false,
          isEligibleToVote: false,
          reason: {
            type: 'not-logged-in',
          },
        };
      }
      // User is logged in, we need to check if they are eligible to do reviews
      const { PeerReview } = contracts;
      if (PeerReview) {
        const { proposalId } = article;
        const ethereumAddress = auth.account.profile.ethereumAddress;
        // Check if user already voted on it, if so indicate as such otherwise check contract constraints
        const { voted } = await articleActions.getUserVotedOn(ethereumAddress, proposalId);
        if (voted) {
          return {
            isCheckingReviewable: false,
            isEligibleToVote: false,
            reason: {
              type: 'already-voted',
            },
          };
        } else {
          const isEligibleToVote = await PeerReview.isEligibleToVote(proposalId, ethereumAddress);
          const reason = !isEligibleToVote
            ? await this.reasonForIneligbleVote(contracts, proposalId, ethereumAddress)
            : {};
          return {
            isCheckingReviewable: false,
            isEligibleToVote,
            reason,
          };
        }
      }
    }
  };

  setTransactionFailed = (bool, callback) => {
    this.setState(
      {
        transactionFailed: bool,
      },
      callback()
    );
  };

  renderView() {
    const { classes } = this.props;
    const {
      isEligibleToVote,
      isCheckingReviewable,
      pendingTransaction,
      reason,
      transactionFailed,
    } = this.state;
    if (isCheckingReviewable) {
      return (
        <div className={classes.loading__container}>
          <LoadingIndicator
            id="review-side-sequence-loading-indicator"
            fadeIn="quarter"
            showing={true}
          />
        </div>
      );
    }
    return (
      <ReviewSequence
        setTransactionFailed={this.setTransactionFailed}
        transactionFailed={transactionFailed}
        pendingTransaction={pendingTransaction}
        eligibleToVote={isEligibleToVote}
        reason={reason}
        title={this.props.title}
      />
    );
  }

  async componentDidUpdate(prevProps) {
    /*
    const peerReviewContractInitialzed =
      this.props.contracts.PeerReview && !prevProps.contracts.PeerReview;
    if (peerReviewContractInitialzed && this.props.auth.isLoggedIn) {
      this.determineReviewState(this.props).then(state => state && this.setState(state));
    }
    */
  }

  async componentDidMount() {
    // this.determineReviewState(this.props).then(state => state && this.setState(state));
  }

  render() {
    const { classes, isAuthor } = this.props;
    return (
      <div className={cx(classes.reviewSideSequence, isAuthor && classes.hide)}>
        <Sticky top={0} bottomBoundary={201}>
          <div className={classes.reviewSection}>{this.renderView()}</div>
        </Sticky>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {};

const styles = (theme) => ({
  loading__container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100vh',
  },
  loading: {
    ...theme.typography.h2,
    fontSize: 18,
    fontWeight: 400,
    marginTop: theme.spacing * 2,
  },
  reviewSideSequence: {
    width: '100%',
    minHeight: '100vh',
    position: 'sticky',
    top: 0,
    alignSelf: 'flex-start',
  },
  reviewSection: {
    display: 'flex',
    justifyContent: 'center',
  },
  hide: {
    display: 'none',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(ReviewSideSequence));
