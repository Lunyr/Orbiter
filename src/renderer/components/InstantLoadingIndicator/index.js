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
      this.setState({ showInstantLoader: true }, this.props.load);
    } else if (!this.props.watch && this.props.watch !== watch) {
      this.setState({ showInstantLoader: false });
    }
  }

  componentDidMount() {
    this.props.load();
  }

  render() {
    const { children, className } = this.props;
    const { showInstantLoader } = this.state;
    return (
      <div className={className}>
        <LoadingIndicator
          id="loading-indicator"
          fadeIn="quarter"
          showing={showInstantLoader}
          full
        />
        {children}
      </div>
    );
  }
}

export default InstantLoadingIndicator;
