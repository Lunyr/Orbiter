import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import { fetchArticleByTitle } from '../../../../shared/redux/modules/article/reader/actions';
import {
  AdditionalContent,
  Contributors,
  ErrorBoundary,
  Hero,
  InstantLoadingIndicator,
  Label,
  MegadraftEditor,
} from '../../../components';
import References from '../references/References';
import styles from './styles';

class Reader extends React.Component {
  load = (titleParam) => {
    this.props.fetchArticleByTitle(titleParam);
  };

  render() {
    const { article, isFetching, classes, intl, titleParam } = this.props;
    const { additionalContent, contributors, title, heroImageHash, editorState } = article;
    const hasAdditionalContent = additionalContent && additionalContent.length > 0;
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
          diff={titleParam}
          watch={isFetching}
          load={this.load}>
          <Label
            className={classes.reviewLabel}
            valueClassName={classes.reviewLabel__value}
            value="Accepted Article"
          />
          <section className={classes.article}>
            <header className={classes.header}>
              <Hero imageHash={heroImageHash} />
            </header>
            <div className={classes.main}>
              <div className={classes.title__container}>
                <h1 className={classes.title}>{title}</h1>
              </div>
              <div className={classes.contributors}>
                <Contributors
                  contributors={contributors}
                  tagLine={
                    <FormattedMessage id="contributors_title" defaultMessage="Contributors" />
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
          <aside
            className={cx({
              [classes.aside]: true,
              [classes.hidden]: !hasAdditionalContent,
            })}>
            <AdditionalContent additionalContent={additionalContent} />
          </aside>
        </InstantLoadingIndicator>
      </ErrorBoundary>
    );
  }
}

// Temporary helper to fix double stringified content
const deserializeAdditionalContent = (additionalContent) => {
  try {
    let parsedContent = JSON.parse(additionalContent);
    if (typeof parsedContent === 'string') {
      // Recursively just try to parse for now until we get an actual array
      parsedContent = deserializeAdditionalContent(parsedContent);
    }
    return parsedContent;
  } catch (err) {
    console.error(err);
    return [];
  }
};

/**
 * Returns a formatted article object to be used in the Readt
 * @param article
 * @returns {*}
 */
const assembleArticle = (article) => {
  if (!article) {
    return {};
  }
  return article;
};

const mapStateToProps = (
  {
    article: {
      reader: { error, data, isFetching },
    },
  },
  {
    match: {
      params: { title: titleParam },
    },
  }
) => ({
  article: assembleArticle(data),
  error,
  isFetching,
  titleParam,
});

const mapDispatchToProps = {
  fetchArticleByTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Reader)));
