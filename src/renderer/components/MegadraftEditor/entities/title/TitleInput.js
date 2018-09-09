import React, { Component } from 'react';

export default class TitleInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.setEntity({ title: 'title' });
  }

  render() {
    return <div />;
  }
}
