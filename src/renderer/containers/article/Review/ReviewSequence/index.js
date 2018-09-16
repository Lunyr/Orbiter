import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import cx from 'classnames';
import { MdCheckCircle as CheckCircleIcon, MdError as ErrorCircleIcon } from 'react-icons/md';
import styles from './styles';

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

  /***
   * Accepts the article and opens the modal for payment
   */
  acceptArticle = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit({
        accepted: true,
      });
    }
  };

  rejectArticle = () => {
    const { onSubmit } = this.props;
    const { checked } = this.state;
    if (onSubmit) {
      onSubmit({
        accepted: false,
        checked,
      });
    }
  };

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
    const { classes, isEligibleToVote, intl, reason } = this.props;
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
    return (
      <div className={cx(classes.reviewSequence, txComplete && classes.centered)}>
        {!isEligibleToVote ? (
          this.renderIneligibleVoteReason(reason)
        ) : txComplete ? (
          <CompletedTransaction txHash={this.state.txhash} review={true} />
        ) : (
          <div className={classes.container}>
            <h2 className={classes.reviewSequence__title}>
              <FormattedMessage id="review_content" defaultMessage="Review Content" />
            </h2>
            <div className={classes.reviewSequence__help}>
              {this.state.page === 'review' ? (
                <Fragment>
                  <div className={classes.criteriaContainer}>
                    <FormattedMessage
                      id="review_content_help"
                      defaultMessage="Please judge whether this content meets Lunyr's article guidelines and should be accepted into the community."
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
                      disabled={checked.length}
                      className={cx(
                        classes.action__accept,
                        checked.length && classes.action__disabled
                      )}
                      onClick={this.acceptArticle}
                      title={intl.formatMessage({
                        id: 'review_accept',
                        defaultMessage: 'Accept',
                      })}>
                      <FormattedMessage id="review_accept" defaultMessage="Accept" />
                    </button>
                    <button
                      disabled={!checked.length}
                      className={cx(
                        classes.action__reject,
                        classes.prominent,
                        !checked.length && classes.action__disabled
                      )}
                      onClick={this.rejectArticle}
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
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {};

export default injectIntl(
  withRouter(
    connect(
      null,
      mapDispatchToProps
    )(injectStyles(styles)(ReviewSequence))
  )
);
