import React from 'react';
import SomethingWentWrong from '../errors/SomethingWentWrong';

/**
 * ErrorBoundary
 * Component that returns handles catching component error flows. This intercepts the errors
 * and can provide users with a better error interface and potentially log to an external error
 * source like `Raven/Sentry` if we integrate with such things.
 *
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null,
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    // You can also log the error to an error reporting service
    console.error('Log error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <SomethingWentWrong {...this.state} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
