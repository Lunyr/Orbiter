import React, { Component } from 'react';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import EntryHeader from './EntryHeader';
import theme from '../../theme';

class Vote extends Component {
  handleClick = () => {
    this.props.onProposalClick({
      proposalId: this.props.proposal.proposalId,
      title: this.props.proposal.title,
    });
  };

  onUserProfileClick = () => {
    return (
      this.props.onUserProfileClick && this.props.onUserProfileClick({ user: this.props.user })
    );
  };

  render() {
    const {
      index = 0,
      isCoalesced = false,
      proposal,
      total = 1,
      createdAt,
      updatedAt,
      user,
    } = this.props;
    return (
      <div onClick={this.handleClick} className={css(styles.link)}>
        <div
          className={css(
            styles.voted,
            styles.card,
            isCoalesced && styles.coalescedCard,
            isCoalesced && index > 0 && styles.coalescedCard__spacer,
            isCoalesced && index === 0 && styles.coalescedCard__topBorderRadius,
            isCoalesced && index === total && styles.coalescedCard__bottomBorderRadius
          )}
          style={{ zIndex: total - index }}
        >
          <EntryHeader
            title={proposal.title}
            actionText={
              <React.Fragment>
                <FormattedMessage id="feed_reviewed_action" defaultMessage="reviewed an article" />
                <span className={css(styles.headerTitle)}>{proposal.title}</span>
              </React.Fragment>
            }
            labelType="gray"
            labelValue={<FormattedMessage id="feed_voted" defaultMessage="Voted" />}
            updatedAt={updatedAt ? updatedAt : createdAt}
            user={user}
            onUserProfileClick={this.onUserProfileClick}
          />
        </div>
      </div>
    );
  }
}

class VotedEntry extends Component {
  render() {
    const { coalesced = [], ...rest } = this.props;

    if (coalesced.length === 0) {
      return <Vote {...rest} />;
    }

    return (
      <div className={css(styles.coalesce__container)}>
        {coalesced.map((item, index) => (
          <Vote
            key={`vote_feed_${item.id || index}`}
            {...item}
            index={index}
            isCoalesced={true}
            total={coalesced.length - 1}
            onUserProfileClick={this.props.onUserProfileClick}
            onProposalClick={this.props.onProposalClick}
          />
        ))}
      </div>
    );
  }
}

VotedEntry.propTypes = {
  acceptance: PropTypes.number,
  proposal: PropTypes.object,
  updatedAt: PropTypes.string,
  user: PropTypes.object,
};

const styles = StyleSheet.create({
  voted: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  link: {
    textDecoration: 'none',
    cursor: 'pointer',
  },
  title: {
    fontWeight: 500,
    textDecoration: 'none',
    color: 'rgba(53, 64, 82, 0.8)',
    marginBottom: 2,
  },
  card: {
    padding: theme.spacing,
    backgroundColor: theme.colors.white,
    height: 90,
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: theme.spacing * 1.5,
    borderRadius: theme.borderRadius,
    wordWrap: 'break-word',
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    transition: 'transform 0.2s',
    ':hover': {
      boxShadow: '0px 0px 25px #cfcfd1',
      transform: 'scale(1.05)',
    },
    '@media only screen and (max-width: 768px)': {
      paddingLeft: theme.spacing,
      paddingRight: theme.spacing,
      padding: '10px',
      height: 'unset',
      transform: 'none',
      boxShadow: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: 0,
      marginBottom: 0,
    },
  },
  coalesce__container: {
    marginBottom: theme.spacing * 1.5,
    '@media only screen and (max-width: 768px)': {
      marginBottom: 0,
    },
  },
  coalescedCard: {
    position: 'relative',
    marginBottom: 0,
    borderRadius: 0,
    ':hover': {
      borderRadius: theme.borderRadius,
    },
  },
  coalescedCard__spacer: {
    borderRadius: 0,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    ':hover': {
      boxShadow: '0px 0px 25px #cfcfd1',
      borderRadius: theme.borderRadius,
      zIndex: 100,
    },
    '@media only screen and (max-width: 768px)': {
      borderTop: 'none',
    },
  },
  coalescedCard__topBorderRadius: {
    borderTopLeftRadius: theme.borderRadius,
    borderTopRightRadius: theme.borderRadius,
  },
  coalescedCard__bottomBorderRadius: {
    borderBottomLeftRadius: theme.borderRadius,
    borderBottomRightRadius: theme.borderRadius,
  },
  headerTitle: {
    marginLeft: 5,
  },
});

export default VotedEntry;
