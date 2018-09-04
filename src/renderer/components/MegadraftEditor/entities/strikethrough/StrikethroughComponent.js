import React from 'react';

export default class StrikethroughComponent extends React.Component {
  render() {
    return <span>{this.props.children}</span>;
  }
}
