import React from 'react';

class MinimumFader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
    };
    this.timeoutId = null;
  }

  componentDidUpdate(prevProps) {
    if (!this.timeoutId) {
      if (this.props.show !== prevProps.show) {
        if (!this.props.show) {
          this.timeoutId = setTimeout(() => {
            this.setState({ show: false }, () => {
              this.timeoutId = null;
            });
          }, this.props.ms);
        } else {
          // Only use the timeout mechanism on clearing
          this.setState({ show: true });
        }
      }
    }
  }

  render() {
    return this.state.show ? this.props.children : null;
  }
}

export default MinimumFader;
