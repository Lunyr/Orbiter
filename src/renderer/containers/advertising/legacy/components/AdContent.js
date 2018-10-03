/***
 * Content of the ad
 * @patr -- patrick@quantfive.org
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';

export default class AdContent extends React.Component {
  render() {
    return <div className={css(styles.adContainer)} />;
  }
}
