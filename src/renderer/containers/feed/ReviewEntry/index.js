import React, { Component } from 'react';
import injectStyles from 'react-jss';
import truncate from 'lodash/truncate';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import EntryHeader from '../EntryHeader';
import styles from './styles';

class ReviewEntry extends Component {
  onProposalClick = () => {
    return (
      this.props.onProposalClick &&
      this.props.onProposalClick({
        proposalId: this.props.proposalId,
        title: this.props.title,
      })
    );
  };

  render() {
    const {
      classes,
      title,
      fromAddress,
      updatedAt,
      heroImageHash,
      description,
      createdAt,
    } = this.props;

    return (
      <div className={classes.link} onClick={this.onProposalClick}>
        <div className={cx(classes.article, classes.card)}>
          <header className={classes.header}>
            <EntryHeader
              actionText={
                <FormattedMessage
                  id="feed_submitted_action"
                  defaultMessage="submitted an article for review"
                />
              }
              labelType="accent"
              labelValue={<FormattedMessage id="feed_review_label" defaultMessage="Peer Review" />}
              updatedAt={updatedAt ? updatedAt : createdAt}
              address={fromAddress}
              title={title}
              onUserProfileClick={this.props.onUserProfileClick}
            />
          </header>
          {heroImageHash && (
            <figure className={classes.figure}>
              <img
                className={classes.image}
                src={`https://ipfs.io/ipfs/${heroImageHash}`}
                alt="Article Hero"
              />
            </figure>
          )}
          <footer className={classes.footer}>
            <div className={cx(classes.title, classes.overflow)}>{title}</div>
            <p className={cx(classes.description, classes.overflow)}>
              {truncate(description, { length: 100 })}
            </p>
          </footer>
        </div>
      </div>
    );
  }
}

ReviewEntry.propTypes = {
  title: PropTypes.string.isRequired,
  updatedAt: PropTypes.string,
  fromAddress: PropTypes.string.isRequired,
};

export default injectStyles(styles)(ReviewEntry);
