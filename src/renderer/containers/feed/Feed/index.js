import React from 'react';
import injectStyles from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import { MdRefresh as RefreshIcon } from 'react-icons/md';
import { fetchFeed, fetchMoreFeed, setFilter } from '../../../../shared/redux/modules/feed/actions';
import {
  IconButton,
  ButtonGroup,
  ErrorBoundary,
  LoadingIndicator,
  Placeholders,
  Select,
} from '../../../components/';
import ArticleEntry from '../ArticleEntry';
import ReviewEntry from '../ReviewEntry';
import VotedEntry from '../VotedEntry';
import styles from './styles';

const matchType = (filter) => ({ type }) => type === filter;

const FeedList = ({ classes, feed, filter, onArticleClick, onProposalClick }) => (
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
              return <ArticleEntry key={key} {...rest} onArticleClick={onArticleClick} />;
            case 'review':
              return <ReviewEntry key={key} {...rest} onProposalClick={onProposalClick} />;
            case 'vote':
              return <VotedEntry key={key} {...rest} onProposalClick={onProposalClick} />;
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
    fetchFeed: PropTypes.func.isRequired,
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
    this.minReadTimeout = 350;
    this.loadMore = throttle(this.loadMore, 5000);
  }

  /*
  * Collapses votes down into a single array if they follow one after another
  */
  coalesceVotes(feed = []) {
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
    const feedDisplay = filter ? feed.filter(matchType(get(filter, 'value'))) : feed;
    return this.coalesceVotes(feedDisplay);
  };

  fetchFeedList = ({ limit, offset }) => {
    this.setState({ isReady: false }, () => {
      this.props.fetchFeed({ limit, offset });
    });
  };

  loadMore = (page) => {
    const { limit } = this.state;
    const { feed } = this.props;
    if (feed && feed.length > 0) {
      this.props.fetchMoreFeed({ limit, offset: limit * page });
    }
  };

  onArticleClick = ({ title }) => {
    this.props.history.push(`/article/${title}`);
  };

  onProposalClick = ({ proposalId, title }) => {
    this.props.history.push(`/review/${proposalId}/${title}`);
  };

  componentDidMount() {
    // Limit is partitioned by 3 for each supported feed type
    // i.e vote, article (reviewed), article (accepted)
    const { limit } = this.state;
    this.fetchFeedList({
      limit,
      offset: 0,
    });
  }

  componentDidUpdate({ isFetching }) {
    if (!this.props.isFetching && isFetching !== this.props.isFetching) {
      // We add a forced timeout for transition to ready state
      setTimeout(() => {
        this.setState({ isReady: true });
      }, this.minReadTimeout);
    }
  }

  render() {
    const {
      classes,
      error,
      filter,
      filterTypes,
      intl,
      isFetching,
      isFetchingMore,
      setFilter,
    } = this.props;
    const { limit, offset } = this.state;
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
              <ButtonGroup gap={10}>
                <h2 className={classes.header__title}>
                  <FormattedMessage id="feed_title" defaultMessage="Lunyr Feed" />
                </h2>
                <IconButton
                  type="button"
                  theme="text"
                  onClick={() => {
                    this.fetchFeedList({
                      limit,
                      offset,
                    });
                  }}
                  icon={<RefreshIcon size={20} />}
                />
              </ButtonGroup>
              <Select
                className={classes.select}
                options={localizedFilterTypes}
                onChange={setFilter}
                value={filter}
              />
            </header>
            <ReactPlaceholder
              ready={this.state.isReady && !isFetching}
              customPlaceholder={<Placeholders.FeedListPlaceholder />}
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
                  filter={get(filter, 'value')}
                  onArticleClick={this.onArticleClick}
                  onProposalClick={this.onProposalClick}
                />
              </InfiniteScroll>
            </ReactPlaceholder>
          </div>
          {/*
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
            </ReactPlaceholder>
          </aside>
          */}
        </section>
      </article>
    );
  }
}

const mapStateToProps = ({ auth, feed }) => ({
  auth,
  ...feed,
});

const mapDispatchToProps = {
  fetchFeed,
  fetchMoreFeed,
  setFilter,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectIntl(injectStyles(styles)(Feed)))
);
