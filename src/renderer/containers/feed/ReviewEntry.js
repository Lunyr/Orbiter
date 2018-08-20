/***
 * Entry in feed for article in review
 */

import React, { Component } from 'react';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import truncate from 'lodash/truncate';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Components
import EntryHeader from './EntryHeader';

// Styles
import theme from '../../theme';

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
    const { title, user, updatedAt, heroImageHash, description, createdAt } = this.props;

    return (
      <div className={css(styles.link)} onClick={this.onProposalClick}>
        <div className={css(styles.article, styles.card)}>
          <header className={css(styles.header)}>
            <EntryHeader
              actionText={
                <FormattedMessage
                  id="feed_submitted_action"
                  defaultMessage="submitted an article for review"
                />
              }
              labelType="lightBlue"
              labelValue={<FormattedMessage id="feed_review_label" defaultMessage="Peer Review" />}
              updatedAt={updatedAt ? updatedAt : createdAt}
              user={user}
              title={title}
              onUserProfileClick={this.props.onUserProfileClick}
            />
          </header>
          {heroImageHash && (
            <figure className={css(styles.figure)}>
              <img
                className={css(styles.image)}
                src={`https://ipfs.io/ipfs/${heroImageHash}`}
                alt="Article Hero"
              />
            </figure>
          )}
          <footer className={css(styles.footer)}>
            <div className={css(styles.title, styles.overflow)}>{title}</div>
            <p className={css(styles.description, styles.overflow)}>
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
  updatedAt: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  link: {
    textDecoration: 'none',
  },
  article: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.05)',
      borderRadius: theme.borderRadius,
      boxShadow: '0px 0px 25px #cfcfd1',
    },
    '@media only screen and (max-width: 768px)': {
      transform: 'none',
      boxShadow: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: 0,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 80,
    flexShrink: 0,
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    width: '100%',
    boxSizing: 'border-box',
    '@media only screen and (max-width: 768px)': {
      paddingLeft: theme.spacing,
      paddingRight: theme.spacing,
      padding: '10px',
      height: 'unset',
    },
  },
  figure: {
    margin: 0,
    height: 200,
    flexGrow: 1,
    textDecoration: 'none',
  },
  image: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 90,
    flexShrink: 0,
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    width: `calc(100% - ${theme.spacing * 4}px)`,
    '@media only screen and (max-width: 768px)': {
      paddingLeft: theme.spacing,
      paddingRight: theme.spacing,
      width: `calc(100% - ${theme.spacing * 2}px)`,
    },
  },
  title: {
    ...theme.typography.header,
    fontWeight: 400,
    fontSize: 22,
    maxWidth: '100%',
  },
  description: {
    ...theme.typography.help,
    fontWeight: 400,
    fontSize: 14,
    color: 'rgba(53, 64, 82, 0.6)',
    maxWidth: '100%',
    margin: '10px 0 0 0',
  },
  card: {
    backgroundColor: theme.colors.white,
    width: '100%',
    marginBottom: theme.spacing * 1.5,
    borderRadius: theme.borderRadius,
    '@media only screen and (max-width: 768px)': {
      borderRadius: 0,
      marginBottom: 0,
    },
  },
  overflow: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
});

export default ReviewEntry;
