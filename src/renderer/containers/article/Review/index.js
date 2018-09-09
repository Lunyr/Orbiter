import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { editorStateFromRaw } from 'megadraft';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';
import { languageToReadable } from '../../../../shared/redux/modules/locale/actions';
import {
  fetchArticleProposal,
  fetchVotingEligibility,
} from '../../../../shared/redux/modules/article/review/actions';
import decorator from '../../../components/MegadraftEditor/decorator';
import {
  Contributors,
  ErrorBoundary,
  Hero,
  Label,
  InstantLoadingIndicator,
  MegadraftEditor,
} from '../../../components';
import References from '../references/References';
import ReviewSideSequence from './ReviewSideSequence';
import styles from './styles';
import { calculateDiff } from './diffUtils';

class Review extends React.Component {
  loadReview = () => {
    const { account, fetchArticleProposal, fetchVotingEligibility, proposalParam } = this.props;
    const proposalId = parseInt(proposalParam, 10);
    fetchArticleProposal(proposalId);
    if (account) {
      fetchVotingEligibility(proposalId, account);
    }
  };

  render() {
    const {
      account,
      article,
      classes,
      diff,
      eligibility,
      intl,
      isFetching,
      isAuthor,
      proposalParam,
    } = this.props;
    const { contributors, title, heroImageHash, lang, oldArticle } = article;
    const references = [];
    return (
      <ErrorBoundary
        errorMsg={intl.formatMessage({
          id: 'reader_error',
          defaultMessage:
            "Oh no, something went wrong! It's okay though, please refresh and your content should return.",
        })}>
        <InstantLoadingIndicator
          className={classes.container}
          diff={proposalParam}
          watch={isFetching}
          load={this.loadReview}>
          <Label
            className={classes.reviewLabel}
            type="accent"
            valueClassName={classes.reviewLabel__value}
            value="Article Proposal"
          />
          <section className={classes.article}>
            <header className={classes.header}>
              <Hero imageHash={heroImageHash} />
            </header>
            <div className={classes.main}>
              <div className={classes.title__container}>
                <h1 className={classes.title}>{title}</h1>
              </div>
              <div
                className={cx(
                  classes.langChange,
                  oldArticle && oldArticle.lang ? classes.langChanged : classes.langAdded
                )}>
                {oldArticle && oldArticle.lang
                  ? `Language: ${languageToReadable[oldArticle.lang]} --> ${
                      languageToReadable[lang]
                    }`
                  : `+Language: ${languageToReadable[lang] || 'English'}`}
              </div>
              <div className={classes.contributors}>
                <Contributors
                  contributors={contributors}
                  tagLine={
                    contributors && contributors.length > 1 ? (
                      <FormattedMessage id="contributors_title" defaultMessage="Contributors" />
                    ) : (
                      <FormattedMessage id="review_contributors_title" defaultMessage="Author" />
                    )
                  }
                />
              </div>
              <div className={classes.editor}>
                <MegadraftEditor editorState={diff} readOnly={true} />
              </div>
              <footer className={classes.footer}>
                <References formatType="MLA" references={references} />
              </footer>
            </div>
          </section>
          <aside className={classes.aside}>
            <ReviewSideSequence
              account={account}
              article={article}
              eligibility={eligibility}
              isAuthor={isAuthor}
            />
          </aside>
        </InstantLoadingIndicator>
      </ErrorBoundary>
    );
  }
}

const performDiff = (article) => {
  if (!article) {
    // Return no diff
    return null;
  } else if (!article.oldArticle || !article.oldArticle.megadraft) {
    // Return original article
    return JSON.parse(article.megadraft);
  } else {
    const { megadraft, oldArticle } = article;
    const newDraftMegadraft = JSON.parse(megadraft);
    const newDraftEditorState = editorStateFromRaw(newDraftMegadraft, decorator);
    const oldArticleMegadraft = JSON.parse(oldArticle.megadraft);
    const oldArticleEditorState = editorStateFromRaw(oldArticleMegadraft, decorator);
    const diff = calculateDiff(
      oldArticleEditorState,
      newDraftEditorState,
      oldArticleMegadraft,
      newDraftMegadraft
    );
    // Need to explicitly return null for an empty diff so that
    // it doesnt blow up the Megadraft editor which freaks out about `{}`
    return !isEmpty(diff) ? diff : null;
  }
};

const mapStateToProps = (
  {
    auth: { account },
    article: {
      review: { error, data, isFetching, eligibility },
    },
  },
  {
    match: {
      params: { proposalId: proposalParam, title: titleParam },
    },
  }
) => ({
  account,
  article: data || {},
  diff: performDiff(data),
  eligibility,
  error,
  isFetching,
  isAuthor: data && data.fromAddress === account,
  proposalParam,
  titleParam,
});

const mapDispatchToProps = {
  fetchArticleProposal,
  fetchVotingEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Review)));
