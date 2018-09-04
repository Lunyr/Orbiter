import React, { Component } from 'react';
import injectStyles from 'react-jss';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import EntryHeader from '../EntryHeader';
import styles from './styles';

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
      classes,
      fromAddress,
      index = 0,
      isCoalesced = false,
      proposal,
      total = 1,
      createdAt,
      updatedAt,
    } = this.props;
    return (
      <div onClick={this.handleClick} className={classes.link}>
        <div
          className={cx({
            [classes.voted]: true,
            [classes.card]: true,
            [classes.coalescedCard]: isCoalesced,
            [classes.coalescedCard__spacer]: isCoalesced && index > 0,
            [classes.coalescedCard__topBorderRadius]: isCoalesced && index === 0,
            [classes.coalescedCard__bottomBorderRadius]: isCoalesced && index === total,
          })}
          style={{ zIndex: total - index }}>
          <EntryHeader
            title={proposal.title}
            actionText={
              <React.Fragment>
                <FormattedMessage id="feed_reviewed_action" defaultMessage="reviewed an article" />
                <span className={classes.headerTitle}>{proposal.title}</span>
              </React.Fragment>
            }
            labelType="gray"
            labelValue={<FormattedMessage id="feed_voted" defaultMessage="Voted" />}
            updatedAt={updatedAt ? updatedAt : createdAt}
            address={fromAddress}
            onUserProfileClick={this.onUserProfileClick}
          />
        </div>
      </div>
    );
  }
}

class VotedEntry extends Component {
  render() {
    const { classes, coalesced = [], ...rest } = this.props;
    if (coalesced.length === 0) {
      return <Vote classes={classes} {...rest} />;
    }
    return (
      <div className={classes.coalesce__container}>
        {coalesced.map((item, index) => (
          <Vote
            key={`vote_feed_${item.id || index}`}
            {...item}
            classes={classes}
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
  fromAddress: PropTypes.string,
};

export default injectStyles(styles)(VotedEntry);
