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
    backgroundColor: theme.colors.white,
    boxShadow: theme.boxShadows.small,
    margin: theme.spacing,
    maxWidth: '30%',
    height: 350,
    overflow: 'hidden',
    '@media only screen and (max-width: 1024px)': {
      maxWidth: '50%',
    },
  },
  item: {
    display: 'flex',
  },
}))(({ classes, children }) => (
  <div className={classes.container}>
    <div className={classes.grid}>
      {React.Children.map(children, (child) => (
        <div className={classes.grid__item}>
          <div className={classes.item}>{child}</div>
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
    const { isFetchingArticles, articles, error } = this.props;
    console.log(articles);
    return (
      <ReactPlaceholder
        customPlaceholder={<GridViewPlaceholder />}
        ready={!isFetchingArticles || articles.length !== 0}
        showLoadingAnimation={true}>
        {articles.length > 0 ? (
          <CardGrid>
            {articles.map((article) => <div key={article.id}>{JSON.stringify(article)}</div>)}
          </CardGrid>
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
});

const mapDispatchToProps = {
  fetchArticles,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(Articles));
