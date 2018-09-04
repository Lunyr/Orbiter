import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import { fetchArticles } from '../../../../shared/redux/modules/explorer/actions';
import styles from './styles';

const GridViewPlaceholder = () => <div>here</div>;

const EmptyPlaceholder = injectStyles((theme) => ({
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  empty__title: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.h2,
    fontSize: '1.1rem',
    fontWeight: 300,
  },
}))(({ classes }) => (
  <div className={classes.empty}>
    <h1 className={classes.empty__title}>
      <FormattedMessage id="CardGrid-empty" defaultMessage="There are no articles found." />
    </h1>
  </div>
));

const CardGrid = injectStyles((theme) => ({
  container: {
    flexGrow: 1,
    overflow: 'auto',
  },
  grid: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  grid__item: {
    maxWidth: 300,
    height: 375,
    padding: 10,
    '@media only screen and (max-width: 900px)': {
      maxWidth: '50%',
    },
  },
  grid__inner: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    boxShadow: theme.boxShadows.small,
    overflow: 'hidden',
    height: '100%',
  },
  item: {
    display: 'flex',
  },
}))(({ classes, children }) => (
  <div className={classes.container}>
    <div className={classes.grid}>
      {React.Children.map(children, (child) => (
        <div className={classes.grid__item}>
          <div className={classes.grid__inner}>
            <div className={classes.item}>{child}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

class Articles extends React.Component {
  componentDidMount() {
    this.props.fetchArticles(0, 0);
  }

  render() {
    const { classes, isFetchingArticles, articles, numberOfArticles, error } = this.props;
    console.log(articles);
    return (
      <ReactPlaceholder
        customPlaceholder={<GridViewPlaceholder />}
        ready={!isFetchingArticles || articles.length !== 0}
        showLoadingAnimation={true}>
        {articles.length > 0 ? (
          <div className={classes.container}>
            <header className={classes.header}>
              <h1 className={classes.title}>
                Articles <span className={classes.numberOfArticles}>({numberOfArticles})</span>
              </h1>
            </header>
            <CardGrid>
              {articles.map((article) => <div key={article.id}>{JSON.stringify(article)}</div>)}
            </CardGrid>
          </div>
        ) : (
          <EmptyPlaceholder />
        )}
      </ReactPlaceholder>
    );
  }
}

const mapStateToProps = ({ explorer: { data: articles, loading: isFetchingArticles, error } }) => ({
  articles,
  error: null,
  isFetchingArticles,
  numberOfArticles: articles.length,
});

const mapDispatchToProps = {
  fetchArticles,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(Articles));
