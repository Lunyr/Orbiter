import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import { fetchArticles } from '../../../../shared/redux/modules/explorer/actions';
import { timeAgoDisplay } from '../../../../shared/utils';
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

const ArticleGrid = injectStyles((theme) => ({
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
    transition: 'transform 0.15s linear, box-shadow 0.15s linear',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
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

const ArticleCard = injectStyles((theme) => ({
  container: {
    flexGrow: 1,
    overflow: 'auto',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius,
    zIndex: 1,
    '&:hover': {
      boxShadow: theme.boxShadows.small,
    },
  },
  image: {
    height: 175,
    width: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing,
  },
  info__header: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    ...theme.typography.h2,
    fontSize: '1.25rem',
    fontWeight: 400,
    ...theme.overflow,
    flexShrink: 0,
    margin: 0,
    padding: 0,
  },
  timestamp: {
    ...theme.typography.small,
    display: 'block',
    marginTop: 5,
    color: theme.colors.gray,
  },
  help: {
    ...theme.typography.body,
    fontWeight: 400,
    lineHeight: '24px',
    maxHeight: 120,
    marginBottom: 0,
    overflow: 'hidden',
  },
}))(({ article: { createdAt, description, heroImageHash, title, updatedAt }, classes }) => (
  <div className={classes.card}>
    <img
      className={classes.image}
      src={heroImageHash ? `https://ipfs.io/ipfs/${heroImageHash}` : require('./placeholder.jpg')}
      alt="Uh oh, can't be found!"
    />
    <div className={classes.info}>
      <div className={classes.info__header}>
        <h3 className={classes.title}>{title}</h3>
        <span className={classes.timestamp}>
          {timeAgoDisplay(updatedAt ? updatedAt : createdAt)}
        </span>
      </div>
      <p className={classes.help}>{description}</p>
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
            <ArticleGrid>
              {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
            </ArticleGrid>
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
