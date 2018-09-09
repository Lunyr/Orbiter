import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { withRouter } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import { MdRefresh as RefreshIcon } from 'react-icons/md';
import {
  ArticleCard,
  ErrorBoundary,
  EmptyPlaceholder,
  IconButton,
  InstantLoadingIndicator,
  Grid,
  Placeholders,
} from '../../../components/';
import { fetchArticles } from '../../../../shared/redux/modules/explorer/actions';
import styles from './styles';

class Articles extends React.Component {
  navigateToArticle = ({ title }) => {
    this.props.history.replace(`/article/${title}`);
  };

  load = () => {
    this.props.fetchArticles(0, 0);
  };

  render() {
    const { classes, isFetchingArticles, articles, numberOfArticles, error } = this.props;
    return (
      <ErrorBoundary error={error}>
        <InstantLoadingIndicator
          className={classes.container}
          watch={isFetchingArticles}
          load={this.load}>
          {(isLoading) => (
            <ReactPlaceholder
              customPlaceholder={<Placeholders.GridViewPlaceholder />}
              ready={!isLoading}
              showLoadingAnimation>
              {articles.length > 0 ? (
                <div className={classes.container}>
                  <header className={classes.header}>
                    <h1 className={classes.title}>
                      Articles
                      <span className={classes.numberOfArticles}>({numberOfArticles})</span>
                    </h1>
                    <IconButton
                      className={classes.refresh}
                      type="button"
                      theme="text"
                      onClick={this.load}
                      icon={<RefreshIcon size={25} />}
                    />
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
                <EmptyPlaceholder>
                  <IconButton
                    type="button"
                    theme="text"
                    onClick={this.load}
                    icon={<RefreshIcon size={30} />}
                  />
                </EmptyPlaceholder>
              )}
            </ReactPlaceholder>
          )}
        </InstantLoadingIndicator>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ explorer: { data: articles, loading: isFetchingArticles, error } }) => ({
  articles: !articles ? [] : articles,
  error,
  isFetchingArticles,
  numberOfArticles: articles ? articles.length : 0,
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
