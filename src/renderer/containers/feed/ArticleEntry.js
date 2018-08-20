import React, { Component } from 'react';
import injectStyles from 'react-jss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import truncate from 'lodash/truncate';
import { cleanUnderscores } from '../../../shared/utils';
// import EntryHeader from './EntryHeader';

// TODO: Add back in entry header
const EntryHeader = () => <div>header</div>;

class ArticleEntry extends Component {
  onArticleClick = () => {
    return this.props.onArticleClick && this.props.onArticleClick({ article: this.props });
  };

  render() {
    const {
      classes,
      description,
      heroImageHash,
      title,
      createdAt,
      updatedAt,
      user,
      parentId,
    } = this.props;
    return (
      <div className={cx(classes.article, classes.card)} onClick={this.onArticleClick}>
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
            labelType="lightBlue"
            labelValue={<FormattedMessage id="feed_article_label" defaultMessage="Article" />}
            updatedAt={updatedAt ? updatedAt : createdAt}
            title={title}
            user={user}
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
  updatedAt: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  link: {
    textDecoration: 'none',
  },
  article: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.2s',
    cursor: 'pointer',
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
      height: 'unset',
      padding: '10px',
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
    height: 100,
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
    textDecoration: 'none',
  },
  description: {
    ...theme.typography.help,
    fontWeight: 400,
    fontSize: 14,
    color: 'rgba(53, 64, 82, 0.6)',
    margin: '10px 0 0 0',
    maxWidth: '100%',
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

export default injectStyles(styles)(ArticleEntry);
