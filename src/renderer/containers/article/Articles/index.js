import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { withRouter } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import {
  ArticleCard,
  ErrorBoundary,
  EmptyPlaceholder,
  Grid,
  Placeholders,
} from '../../../components/';
import { fetchArticles } from '../../../../shared/redux/modules/explorer/actions';
import styles from './styles';

class Articles extends React.Component {
  navigateToArticle = ({ title }) => {
    this.props.history.replace(`/article/${title}`);
  };

  componentDidMount() {
    this.props.fetchArticles(0, 0);
  }

  render() {
    const { classes, isFetchingArticles, articles, numberOfArticles, error } = this.props;
    return (
      <ErrorBoundary error={error}>
        <ReactPlaceholder
          customPlaceholder={<Placeholders.GridViewPlaceholder />}
          ready={!isFetchingArticles || articles.length !== 0}
          showLoadingAnimation>
          {articles.length > 0 ? (
            <div className={classes.container}>
              <header className={classes.header}>
                <h1 className={classes.title}>
                  Articles <span className={classes.numberOfArticles}>({numberOfArticles})</span>
                </h1>
              </header>
              <Grid>
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={this.navigateToArticle.bind(this, article)}
                  />
                ))}
              </Grid>
            </div>
          ) : (
            <EmptyPlaceholder />
          )}
        </ReactPlaceholder>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ explorer: { data: articles, loading: isFetchingArticles, error } }) => ({
  articles,
  error,
  isFetchingArticles,
  numberOfArticles: articles.length,
});

const mapDispatchToProps = {
  fetchArticles,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectStyles(styles)(Articles))
);
