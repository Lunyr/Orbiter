import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { editorStateFromRaw } from 'megadraft';
import cx from 'classnames';
import { languageToReadable } from '../../../../shared/redux/modules/locale/actions';
import { fetchArticleProposal } from '../../../../shared/redux/modules/article/review/actions';
import decorator from '../../../components/MegadraftEditor/decorator';
import {
  Contributors,
  ErrorBoundary,
  Hero,
  Label,
  LoadingIndicator,
  MegadraftEditor,
} from '../../../components';
import References from '../references/References';
import ReviewSideSequence from './ReviewSideSequence';
import styles from './styles';
import { calculateDiff } from './diffUtils';

class Review extends React.Component {
  state = {
    loadingDiff: true,
  };

  static getDerivedStateFromProps(props) {
    const {
      article: { megadraft, oldArticle },
    } = props;

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

    return {
      editorState: diff,
      loadingDiff: false,
    };
  }

  componentDidUpdate({ proposalParam }) {
    if (this.props.proposalParam !== proposalParam) {
      this.props.fetchArticleProposal(this.props.proposalParam);
    }
  }

  componentDidMount() {
    this.props.fetchArticleProposal(this.props.proposalParam);
  }

  render() {
    const { article, isFetching, classes, intl, isAuthor } = this.props;
    const { editorState, loadingDiff } = this.state;
    if (isFetching || loadingDiff) {
      return (
        <LoadingIndicator
          id="article-loading-indicator"
          className={classes.loader}
          fadeIn="quarter"
          showing={true}
        />
      );
    }
    const { contributors, title, heroImageHash, lang, oldArticle } = article;
    const references = [];
    console.log(article);
    return (
      <ErrorBoundary
        errorMsg={intl.formatMessage({
          id: 'reader_error',
          defaultMessage:
            "Oh no, something went wrong! It's okay though, please refresh and your content should return.",
        })}>
        <div className={classes.container}>
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
                <MegadraftEditor editorState={editorState} readOnly={true} />
              </div>
              <footer className={classes.footer}>
                <References formatType="MLA" references={references} />
              </footer>
            </div>
          </section>
          <aside className={classes.aside}>
            <ReviewSideSequence article={article} isAuthor={isAuthor} />
          </aside>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (
  {
    auth: { account },
    article: {
      review: { error, data, isFetching },
    },
  },
  {
    match: {
      params: { proposalId: proposalParam, title: titleParam },
    },
  }
) => ({
  article: data || {},
  error,
  isFetching,
  isAuthor: data.fromAddress === account,
  proposalParam,
  titleParam,
});

const mapDispatchToProps = {
  fetchArticleProposal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Review)));
