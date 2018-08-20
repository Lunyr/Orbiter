import React from 'react';
import injectStyles from 'react-jss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage, injectIntl } from 'react-intl';
import throttle from 'lodash/throttle';

/*
import { FeedActions } from '../../redux/feed';
import { ArticleActions } from '../../redux/actions/article/ArticleActions';
import { DiscoverActions } from '../../redux/discover';
*/

import { Card, ErrorBoundary, LoadingIndicator, Select } from '../../components/';

import { formatDisplayDate } from '../../../shared/utils';

import ArticleEntry from './ArticleEntry';
/*
import ReviewEntry from './ReviewEntry';
import VotedEntry from './VotedEntry';
*/
import { FeaturedCardsPlaceholder, FeedListPlaceholder } from './placeholders';

const matchType = (filter) => ({ type }) => type === filter;

const ReviewEntry = () => <div>Review</div>;
const VotedEntry = () => <div>VotedEntry</div>;

const FeedList = ({
  classes,
  feed,
  filter,
  onArticleClick,
  onUserProfileClick,
  onProposalClick,
}) => (
  <ErrorBoundary
    errorMsg={
      <FormattedMessage
        id="feed_error"
        defaultMessage="Oh no, something went wrong! Please refresh the page"
      />
    }>
    <div className={classes.feed__list}>
      {feed.length === 0 ? (
        <h2 className={classes.empty}>
          {filter ? (
            <FormattedMessage
              id="feed_noFilterResults"
              defaultMessage="There are no matching results"
            />
          ) : (
            <FormattedMessage id="feed_empty" defaultMessage="Feed is empty" />
          )}
        </h2>
      ) : (
        feed.map(({ id, type, ...rest }, index) => {
          const key = `${type}_${id}_${index}`;
          switch (type) {
            case 'article':
              return (
                <ArticleEntry
                  key={key}
                  {...rest}
                  onArticleClick={onArticleClick}
                  onUserProfileClick={onUserProfileClick}
                />
              );
            case 'review':
              return (
                <ReviewEntry
                  key={key}
                  {...rest}
                  onProposalClick={onProposalClick}
                  onUserProfileClick={onUserProfileClick}
                />
              );
            case 'vote':
              return (
                <VotedEntry
                  key={key}
                  {...rest}
                  onProposalClick={onProposalClick}
                  onUserProfileClick={onUserProfileClick}
                />
              );
            default:
              console.warn('Unknown Type For Feed Seen:', type);
              return null;
          }
        })
      )}
    </div>
  </ErrorBoundary>
);

class Feed extends React.Component {
  static propTypes = {
    fetchFeeds: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    feed: PropTypes.array.isRequired,
  };

  constructor() {
    super();
    this.state = {
      isReady: false,
      limit: 30,
      loadingMore: false,
    };
    this.minReadTimeout = 500;
    this.loadMore = throttle(this.loadMore, 5000);
  }

  /*
  * Collapses votes down into a single array if they follow one after another
  */
  coalesceVotes(feed) {
    const coalescedFeed = feed.reduce(
      (acc, item) => {
        const { type } = item;
        const { previous } = acc;
        if (type === 'vote' && previous.type === 'vote') {
          // Remove and replace item w/ coalesce
          const previousItem = acc.feed.pop();
          let coalesceditem = {
            type: 'vote',
          };
          if (!previousItem.coalesced) {
            coalesceditem.coalesced = [previousItem, item];
          } else {
            coalesceditem.coalesced = [...previousItem.coalesced, item];
          }
          acc.feed.push(coalesceditem);
        } else {
          acc.feed.push(item);
        }
        acc.previous = item;
        return acc;
      },
      {
        previous: {},
        feed: [],
      }
    );
    return coalescedFeed.feed;
  }

  filteredFeeds = () => {
    const { feed, filter } = this.props;
    const feedDisplay = filter ? feed.filter(matchType(filter)) : feed;
    return this.coalesceVotes(feedDisplay);
  };

  fetchFeedList = ({ limit, offset }) => {
    this.props.fetchFeeds({ limit, offset });
  };

  loadMore = (page) => {
    const { feed, limit } = this.state;
    if (feed && feed.length > 0) {
      this.props.fetchFeeds({ limit, offset: limit * page }, true);
    }
  };

  componentDidMount() {
    // Limit is partitioned by 3 for each supported feed type
    // i.e vote, article (reviewed), article (accepted)
    const { limit } = this.state;
    // TODO: Add back in calls to get the datas
    /*
    this.fetchFeedList({
      limit,
      offset: 0,
    });
    */
    // Fetch featured articles for sidebar
    // this.props.getFeaturedArticles();
  }

  componentWillReceiveProps({ isFetching }) {
    if (!isFetching && this.props.isFetching !== isFetching) {
      // We add a forced timeout for transition to ready state
      setTimeout(() => {
        this.setState({ isReady: true });
      }, this.minReadTimeout);
    }
  }

  render() {
    const {
      auth,
      classes,
      error,
      featuredArticles,
      filter,
      filterTypes,
      intl,
      isFetching,
      isFetchingMore,
      isFetchingDiscoverPage,
      setFilter,
      onArticleClick,
      onUserProfileClick,
      onProposalClick,
    } = this.props;
    const filteredFeed = this.filteredFeeds();
    const localizedFilterTypes = filterTypes.map(({ value, label }) => ({
      value,
      label: intl.formatMessage({
        id: `feed_filter_${value}`,
        defaultMessage: label,
      }),
    }));
    return (
      <article className={classes.container}>
        <section className={classes.feed}>
          <div className={classes.feed__column}>
            <header className={classes.feed__header}>
              <h2 className={classes.header__title}>
                <FormattedMessage id="feed_title" defaultMessage="Lunyr Feed" />
              </h2>
              <Select
                className={classes.select}
                options={localizedFilterTypes}
                onChange={setFilter}
                value={filter}
              />
            </header>
            <ReactPlaceholder
              ready={this.state.isReady && !isFetching}
              customPlaceholder={<FeedListPlaceholder />}
              showLoadingAnimation={true}>
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={!error && filteredFeed.length > 3}
                loader={
                  isFetchingMore &&
                  !error && (
                    <div className={classes.loader} key={0}>
                      <LoadingIndicator isFixed={false} isTransparent={true} />
                    </div>
                  )
                }
                threshold={300}>
                <FeedList
                  classes={classes}
                  feed={filteredFeed}
                  filter={filter}
                  onArticleClick={onArticleClick}
                  onUserProfileClick={onUserProfileClick}
                  onProposalClick={onProposalClick}
                />
              </InfiniteScroll>
            </ReactPlaceholder>
          </div>
          <aside className={classes.feed__aside}>
            <header className={classes.feed__header}>
              <h2 className={classes.header__title}>
                <FormattedMessage id="feed_featured" defaultMessage="Featured Articles" />
              </h2>
              <div className={classes.header__spacer} />
            </header>
            <ReactPlaceholder
              ready={this.state.isReady && !isFetchingDiscoverPage}
              customPlaceholder={<FeaturedCardsPlaceholder />}
              showLoadingAnimation={true}>
              <h2 className={classes.empty}>
                <FormattedMessage
                  id="feed_noFeatured"
                  defaultMessage="There are no featured articles"
                />
              </h2>
              {/*
              <div className={classes.featured__list}>
                {featuredArticles.length === 0 ? (
                  <h2 className={classes.empty}>
                    <FormattedMessage
                      id="feed_noFeatured"
                      defaultMessage="There are no featured articles"
                    />
                  </h2>
                ) : (
                  featuredArticles.map(
                    ({ id, description, heroImageHash, state, title, updatedAt, userId }) => (
                      <Link key={id} to={`/article/${title}`} className={classes.featured__article}>
                        <Card
                          currentUserId={auth.account.id}
                          srcImg={`https://ipfs.io/ipfs/${heroImageHash}`}
                          title={title}
                          description={description}
                          updatedOn={formatDisplayDate(updatedAt)}
                          type="discover"
                          state={state}
                          proposalID={id}
                          userId={userId}
                        />
                      </Link>
                    )
                  )
                )}
              </div>
              */}
            </ReactPlaceholder>
          </aside>
        </section>
      </article>
    );
  }
}

const mapStateToProps = ({
  auth,
  //discover: { featuredArticles, isFetchingDiscoverPage },
  //feed,
  //modals: { openSlideMenu },
}) => ({
  auth,
  // ...feed,
  fetchFeeds: () => console.log('fetch feeds'),
  isFetching: false,
  feed: [],
  featuredArticles: [],
  filterTypes: [],
  isFetchingDiscoverPage: false,
});

const mapDispatchToProps = {};

/*
const mapDispatchToProps = {
  fetchFeeds: FeedActions.fetch,
  getFeaturedArticles: DiscoverActions.getDiscoverPage,
  setFilter: FeedActions.setFilter,
  onArticleClick: goToArticle,
  onUserProfileClick: goToUserProfile,
  onProposalClick: goToProposal,
};
*/

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
    paddingRight: theme.spacing * 2,
  },
  feed: {
    display: 'inline-flex',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
    paddingTop: theme.spacing * 2,
  },
  select: {
    width: 150,
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.h1,
    fontSize: 20,
    fontWeight: 300,
  },
  feed__column: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    width: `calc(100% - ${theme.spacing * 4}px)`,
    flexGrow: 1,
    marginBottom: theme.spacing * 2,
    maxWidth: 650,
  },
  feed__aside: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: 300,
    flexShrink: 0,
  },
  header__spacer: {
    height: 48,
  },
  feed__header: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    minHeight: 50,
    justifyContent: 'space-between',
    paddingBottom: theme.spacing * 0.5,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing * 2,
  },
  header__title: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.h1,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(53, 64, 82, 0.8)',
  },
  feed__list: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: '100%',
  },
  featured__list: {
    height: 'auto',
    width: '100%',
  },
  featured__article: {
    display: 'block',
    marginBottom: theme.spacing * 1.5,
    textDecoration: 'none',
  },
  loader: {
    position: 'relative',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 500,
    width: '100%',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Feed)));
