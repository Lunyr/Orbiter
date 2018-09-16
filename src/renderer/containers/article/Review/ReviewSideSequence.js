import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import { Link } from '../../../components';
import ReviewSequence from './ReviewSequence/';
import { MdWarning as WarningIcon } from 'react-icons/md';

class ReviewSideSequence extends React.Component {
  render() {
    const { account, classes, eligibility, isAuthor, onSubmit } = this.props;
    return (
      <div className={cx({ [classes.reviewSideSequence]: true, [classes.hide]: isAuthor })}>
        <div className={classes.reviewSection}>
          {!account ? (
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
                <Link to="/login" className={classes.link}>
                  <FormattedMessage id="review_notLoggedIn_link" defaultMessage="Login" />
                </Link>
              </p>
            </div>
          ) : (
            <ReviewSequence {...eligibility} onSubmit={onSubmit} />
          )}
        </div>
      </div>
    );
  }
}

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

export default injectStyles(styles)(ReviewSideSequence);
