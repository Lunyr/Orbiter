import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import { LoadingIndicator, Link } from '../../../components';
import { fetchVotingEligibility } from '../../../../shared/redux/modules/article/review/actions';
import ReviewSequence from './ReviewSequence/';
import { MdWarning as WarningIcon } from 'react-icons/md';

class ReviewSideSequence extends React.Component {
  async componentDidUpdate(prevProps) {
    /*
    const peerReviewContractInitialzed =
      this.props.contracts.PeerReview && !prevProps.contracts.PeerReview;
    if (peerReviewContractInitialzed && this.props.auth.isLoggedIn) {
      this.determineReviewState(this.props).then(state => state && this.setState(state));
    }
    */
  }

  componentDidMount() {
    const { account, fetchVotingEligibility, proposalId } = this.props;
    if (account) {
      fetchVotingEligibility(proposalId, account);
    }
  }

  render() {
    const { classes, eligibility, isAuthor, isLoggedIn } = this.props;
    return (
      <div className={cx({ [classes.reviewSideSequence]: true, [classes.hide]: isAuthor })}>
        <div className={classes.reviewSection}>
          {!isLoggedIn ? (
            <div className={classes.voteStatus}>
              <WarningIcon className={classes.checkMark} size={60} />
              <p className={classes.voteStatus__header}>
                <FormattedMessage id="review_notLoggedIn" defaultMessage="You are not logged in!" />
              </p>
              <p className={classes.voteStatus__help}>
                <FormattedMessage
                  id="review_notLoggedIn_explain"
                  defaultMessage="You must be logged in to perform peer reviews."
                />
              </p>
              <p>
                <Link to="/login" className={classes.link} isModal={true}>
                  <FormattedMessage id="review_notLoggedIn_link" defaultMessage="Login" />
                </Link>
              </p>
            </div>
          ) : (
            <ReviewSequence {...eligibility} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  {
    auth: { account, isLoggedIn },
    article: {
      review: { eligibility },
    },
  },
  { article: { proposalId } }
) => ({
  account,
  eligibility,
  isLoggedIn,
  proposalId,
});

const mapDispatchToProps = {
  fetchVotingEligibility,
};

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
    alignSelf: 'flex-start',
    height: '100%',
  },
  reviewSection: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  hide: {
    display: 'none',
  },
  voteStatus: {
    textAlign: 'center',
    paddingTop: theme.spacing,
  },
  voteStatus__header: {
    ...theme.typography.h2,
    fontSize: 20,
    fontWeight: 500,
    marginTop: theme.spacing,
  },
  voteStatus__help: {
    ...theme.typography.body,
    lineHeight: '24px',
  },
  checkMark: {
    color: theme.colors.primary,
  },
  link: {
    textDecoration: 'none',
    color: theme.colors.link,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(ReviewSideSequence));
