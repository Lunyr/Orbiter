import React from 'react';
import LoadingIndicator from '../LoadingIndicator/';

/**
 * Special wrapping component that will help show an immediate loading indicator based on a `diff` key
 * Will unload when the pairing `watch` key switches values
 *
 * Fires off new query when `diff` is different
 */
class InstantLoadingIndicator extends React.PureComponent {
  state = {
    showInstantLoader: true,
  };

  componentDidUpdate({ diff, watch }) {
    if (this.props.diff !== diff) {
      this.setState({ showInstantLoader: true }, this.props.load.bind(this, this.props.diff));
    } else if (!this.props.watch && this.props.watch !== watch) {
      setTimeout(() => {
        this.setState({ showInstantLoader: false });
      }, this.props.minimumTimeoutMS || 0);
    }
  }

  componentDidMount() {
    this.props.load(this.props.diff);
  }

  render() {
    const { children, className, diff } = this.props;
    const { showInstantLoader } = this.state;
    return (
      <div className={className} key={diff}>
        {showInstantLoader ? (
          <LoadingIndicator
            id="loading-indicator"
            fadeIn="quarter"
            showing={showInstantLoader}
            full
          />
        ) : typeof children === 'function' ? (
          children(showInstantLoader)
        ) : (
          children
        )}
      </div>
    );
  }
}

export default InstantLoadingIndicator;
