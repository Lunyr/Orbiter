import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { TwoColumn } from '../../components';
import Sidebar from './Sidebar';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

class App extends React.Component {
  render() {
    const { footerHeight, headerHeight, sidebarWidth } = this.props;
    return (
      <TwoColumn sidebarWidth={sidebarWidth}>
        <Sidebar />
        <React.Fragment>
          <Header height={headerHeight} />
          <Content />
          <Footer height={footerHeight} />
        </React.Fragment>
      </TwoColumn>
    );
  }
}

const mapStateToProps = ({ app: { footerHeight, headerHeight, sidebarWidth } }) => ({
  footerHeight,
  headerHeight,
  sidebarWidth,
});

export default injectIntl(connect(mapStateToProps)(App));
