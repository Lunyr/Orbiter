/***
 *
 * @patr -- patrick@quantfive.org
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';

// Components
import AdContent from './components/AdContent';
import AdPerformance from './components/AdPerformance';
import AdditionalBid from './components/AdditionalBid';
import BiddingHistory from './components/BiddingHistory';

class SpecificAdvertisingPage extends React.Component {
  render() {
    return (
      <div className={css(styles.advertisingPage)}>
        <SubHeader subHeaderTitle="Advertise on Lunyr" location={this.props.match.path} />
        <div className={css(styles.adContent)}>
          <AdContent />
        </div>

        <div className={css(styles.lower)}>
          <div className={css(styles.left)}>
            <AdPerformance />
          </div>
          <div className={css(styles.right)}>
            <AdditionalBid />
            <BiddingHistory />
          </div>
        </div>
      </div>
    );
  }
}

export default SpecificAdvertisingPage;
