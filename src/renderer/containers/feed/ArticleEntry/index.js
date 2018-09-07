import React, { Component } from 'react';
import injectStyles from 'react-jss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import truncate from 'lodash/truncate';
import { cleanUnderscores } from '../../../../shared/utils';
import EntryHeader from '../EntryHeader/';
import styles from './styles';

class ArticleEntry extends Component {
  render() {
    const {
      classes,
      description,
      heroImageHash,
      title,
      createdAt,
      updatedAt,
      fromAddress,
      parentId,
      onArticleClick,
    } = this.props;
    return (
      <div
        className={cx(classes.article, classes.card)}
        onClick={onArticleClick.bind(this, { title })}>
        <header className={classes.header}>
          <EntryHeader
            actionText={
              parentId !== 0 ? (
                <FormattedMessage
                  id="feed_article_edit_action"
                  defaultMessage="edited an article"
                />
              ) : (
                <FormattedMessage id="feed_article_add_action" defaultMessage="added an article" />
              )
            }
            labelType="primary"
            labelValue={<FormattedMessage id="feed_article_label" defaultMessage="Article" />}
            updatedAt={updatedAt ? updatedAt : createdAt}
            title={title}
            address={fromAddress}
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
          <h2 className={cx(classes.title, classes.overflow)}>{cleanUnderscores(title)}</h2>
          <p className={cx(classes.description, classes.overflow)}>
            {truncate(description, { length: 100 })}
          </p>
        </footer>
      </div>
    );
  }
}

ArticleEntry.propTypes = {
  description: PropTypes.string.isRequired,
  heroImageHash: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  updatedAt: PropTypes.string,
  fromAddress: PropTypes.string,
};

export default injectStyles(styles)(ArticleEntry);
