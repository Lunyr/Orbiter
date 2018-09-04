/***
 * Title component for title entity
 * @patr -- patrick@quantfive.org
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';

// Actions
import { ArticleActions } from '../../../../redux/actions/article/ArticleActions';
import theme from '../../../../theme';

class TitleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // TODO: figure out how to get readonly variable in here
    var readOnly = false;
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/edit')) {
      readOnly = true;
    }
    return (
      <div className={css(styles.titleContainer)}>
        {readOnly ? null : (
          <div className={css(styles.sectionTitle)}>
            <span className={css(styles.sectionText)}>Section Title </span>
          </div>
        )}
        <div className={css(styles.title)}>{this.props.children}</div>
      </div>
    );
  }
}

var styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '40px',
    paddingBottom: '14px',
    borderBottom: '1px solid rgba(0, 0, 0, .1)',
  },
  title: {
    ...theme.typography.header,
    fontWeight: 400,
    fontSize: 24,
  },
  sectionTitle: {
    borderRight: '1px solid #979797',
    width: '50px',
    textAlign: 'right',
    fontSize: '12px',
    fontFamily: 'Roboto',
    padding: '3px',
    lineHeight: '16px',
    marginRight: '15px',
  },
  sectionText: {
    opacity: '.8',
  },
});

const mapDispatchToProps = dispatch => ({
  articleActions: bindActionCreators(ArticleActions, dispatch),
});

export default connect(null, mapDispatchToProps)(TitleComponent);
