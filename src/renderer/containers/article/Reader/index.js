import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { fetchArticleByTitle } from '../../../../shared/redux/modules/article/reader/actions';
import {
  Contributors,
  ErrorBoundary,
  Hero,
  Label,
  LoadingIndicator,
  MegadraftEditor,
} from '../../../components';
import References from '../references/References';
import styles from './styles';

const AddtionalContent = () => <div>Additional Content</div>;

class Reader extends React.Component {
  componentDidUpdate({ titleParam }) {
    if (this.props.titleParam !== titleParam) {
      this.props.fetchArticleByTitle(this.props.titleParam);
    }
  }

  componentDidMount() {
    this.props.fetchArticleByTitle(this.props.titleParam);
  }

  render() {
    const { article, isFetching, classes, intl } = this.props;
    console.log('reader props', this.props);
    if (isFetching) {
      return (
        <LoadingIndicator
          id="article-loading-indicator"
          className={classes.loader}
          fadeIn="quarter"
          showing={true}
        />
      );
    }
    const { contributors, title, heroImageHash, editorState } = article;
    const references = [];
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
          <aside className={classes.aside}>
            <AddtionalContent />
          </aside>
        </div>
      </ErrorBoundary>
    );
  }
}

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
  article: data || {},
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
