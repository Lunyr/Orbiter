import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import cx from 'classnames';
import { MdSearch as SearchIcon } from 'react-icons/md';
import { FaSpinner as SpinIcon, FaTimesCircle as TimesCircleIcon } from 'react-icons/fa';
import { search } from '../../../../shared/redux/modules/search/actions';
import { AutoSizer, List, IconButton } from '../../../components';
import { cleanUnderscores } from '../../../../shared/utils';
import styles from './styles';

const renderArticleLink = ({ classes, onClick, results, detached }, { index, style }) => {
  const { id, description, heroImageHash, title } = results[index];
  const imageUrl = heroImageHash && `https://ipfs.io/ipfs/${heroImageHash}`;
  return (
    <Link
      key={id}
      to={`/article/${title}`}
      className={cx(classes.link, classes.articleLink)}
      onClick={onClick}
      style={style}>
      <div className={cx({ [classes.result]: true, [classes.result__detached]: detached })}>
        <img
          className={classes.result__image}
          src={imageUrl}
          alt="Sorry, we can't find the item in IPFS!"
        />
        <div className={classes.result__text}>
          <div className={classes.result__title}>{cleanUnderscores(title)}</div>
          <div className={classes.result__description}>{description}</div>
        </div>
      </div>
    </Link>
  );
};
const SearchResults = ({
  classes,
  error,
  detached = false,
  isFocused,
  isSearching,
  minWidth,
  offsetTop,
  onClick,
  results,
}) => {
  const resultCount = (results && results.length) || 0;
  const rowHeight = 100;
  const hasResults = results && resultCount > 0;
  const resultItemHeight = resultCount * rowHeight;
  const showResultBox = isFocused && results !== null;
  const height = detached ? resultItemHeight : Math.min(350, resultItemHeight);
  const containerMinWidth = detached ? '100%' : minWidth;
  return (
    <div
      className={cx(
        classes.results,
        showResultBox && classes.show,
        detached && classes.results__detached
      )}
      style={{
        minWidth: containerMinWidth,
        top: offsetTop,
      }}>
      {!isSearching && error ? (
        <div className={classes.results__error} style={{ minWidth: containerMinWidth }}>
          {error.toString()}
        </div>
      ) : hasResults ? (
        <section
          className={cx(
            classes.results__container,
            detached && classes.results__container__detached
          )}>
          {detached ? (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  className={classes.list}
                  height={height - 15}
                  overscanRowCount={15}
                  rowCount={resultCount}
                  rowHeight={rowHeight}
                  rowRenderer={renderArticleLink.bind(this, {
                    classes,
                    onClick,
                    results,
                    detached,
                  })}
                  width={width}
                />
              )}
            </AutoSizer>
          ) : (
            <List
              className={classes.list}
              height={height}
              overscanRowCount={15}
              rowCount={resultCount}
              rowHeight={rowHeight}
              rowRenderer={renderArticleLink.bind(this, { classes, onClick, results, detached })}
              width={containerMinWidth}
            />
          )}
        </section>
      ) : (
        <div className={classes.results__empty} style={{ minWidth: containerMinWidth }}>
          {!isSearching && detached ? (
            <h2 className={classes.empty__text}>
              <FormattedMessage id="search_help" defaultMessage="Search for an article by title" />
            </h2>
          ) : isSearching ? (
            <React.Fragment>
              <SpinIcon className={classes.empty__icon} size={35} />
              <h2 className={classes.empty__text}>
                <FormattedMessage id="search_searching" defaultMessage="Searching..." />
              </h2>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <SearchIcon className={classes.empty__icon} size={35} />
              <h2 className={classes.empty__text}>
                <FormattedMessage id="search_noResultsFound" defaultMessage="No Results Found" />
              </h2>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};

const SearchAction = ({ classes, height, isSearching }) => (
  <div className={cx(classes.action, classes.offsetLeft)} style={{ height }}>
    <IconButton
      aria-label="Search"
      className={cx(classes.action__button, classes.searchIcon, isSearching && classes.disabled)}
      disabled={isSearching}
      type="submit"
      icon={isSearching ? <SpinIcon size={20} className="icon-spin" /> : <SearchIcon size={20} />}
    />
  </div>
);

const ClearAction = ({ classes, height, isShowing, isSearching, onClear }) => (
  <div
    className={cx(classes.action, classes.offsetRight, !isShowing && classes.hidden)}
    style={{ height }}>
    <IconButton
      aria-label="Clear"
      className={cx(classes.action__button, classes.clearIcon, isSearching && classes.disabled)}
      disabled={isSearching}
      onClick={onClear}
      type="button">
      <TimesCircleIcon size={22} />
    </IconButton>
  </div>
);

class SearchBar extends React.Component {
  static defaultProps = {
    height: 35,
    resultLimit: 20,
    width: 350,
  };

  static propTypes = {
    height: PropTypes.number,
    resultLimit: PropTypes.number,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      term: '',
    };
    this.node = undefined;
    this.searchInput = undefined;
    this.handleSearch = debounce(this.handleSearch.bind(this), 1000);
  }

  handleClear = () => {
    this.setState(
      {
        isFocused: false,
        term: '',
      },
      this.props.clearSearchResults
    );
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  handleSearch = () => {
    const { term } = this.state;
    const { resultLimit, search } = this.props;
    search(term, resultLimit);
  };

  handleSearchInput = (e) => {
    const term = e.target.value;
    this.setState({ term, isFocused: true }, this.handleSearch);
  };

  handleDocumentClick = (e) => {
    const { isFocused } = this.state;
    if (!isFocused || !this.node) {
      return;
    }
    // Check if we should close the results panel due to click off the current node
    if (!this.node.contains(e.target)) {
      e.stopPropagation();
      this.setState({ isFocused: false });
    }
  };

  handleKeydown = (e) => {
    switch (e.code) {
      // Search on enter as well
      case 'Enter': {
        this.handleSearch();
        break;
      }

      // Open when arrow down
      case 'ArrowDown': {
        const { isFocused } = this.state;
        if (!isFocused) {
          this.setState({ isFocused: true });
        }
        break;
      }

      // Close when arrow up or escape
      case 'Escape':
      case 'ArrowUp': {
        const { isFocused } = this.state;
        if (isFocused) {
          this.setState({ isFocused: false });
        }
        break;
      }

      default:
        return;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isFocused !== prevState.isFocused) {
      if (this.state.isFocused) {
        window.addEventListener('click', this.handleDocumentClick);
        this.searchInput.removeEventListener('keydown', this.handleKeydown);
      } else {
        window.removeEventListener('click', this.handleDocumentClick);
        this.searchInput.addEventListener('keydown', this.handleKeydown);
      }
    }
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.focus();
      }
    }, 300);
  }

  render() {
    const {
      classes,
      detached,
      height,
      intl,
      isSearching,
      searchError,
      searchResults,
      width,
    } = this.props;
    const { isFocused, term } = this.state;
    const hasTerm = term.length > 0;
    return (
      <div className={classes.searchBar} ref={(node) => (this.node = node)}>
        <form
          autoComplete="off"
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          style={{ height }}>
          <SearchAction classes={classes} height={height} isSearching={isSearching} />
          <div className={classes.input__container} style={{ height }}>
            <label htmlFor="search-bar-input" className={classes.srOnly}>
              <FormattedMessage id="search_display" defaultMessage="Search" />
            </label>
            <input
              id="search-bar-input"
              autoFocus={true}
              ref={(r) => (this.searchInput = r)}
              className={classes.input}
              disabled={isSearching}
              onChange={this.handleSearchInput}
              placeholder={intl.formatMessage({
                id: 'search_placeholder',
                defaultMessage: 'Search Articles',
              })}
              style={{ width }}
              type="search"
              value={term}
            />
          </div>
        </form>
        <SearchResults
          classes={classes}
          error={searchError}
          detached={detached}
          hasTerm={hasTerm}
          isFocused={isFocused}
          isSearching={isSearching}
          minWidth={500}
          offsetTop={height + 3}
          onClick={this.handleBlur}
          results={searchResults}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  search: { loading: isSearching, data: searchResults, error: searchError },
}) => ({
  isSearching,
  searchError,
  searchResults,
});

const mapDispatchToProps = {
  search,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(SearchBar)));
