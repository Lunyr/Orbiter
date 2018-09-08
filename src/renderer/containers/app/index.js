import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import { connectToBlockchain } from '../../../shared/redux/modules/app/actions';
import { Modal, TwoColumn } from '../../components';
import Articles from '../article/Articles';
import Draft from '../article/Draft';
import Editor from '../article/Editor';
import Feed from '../feed/Feed';
import Proposal from '../article/Proposal';
import Reader from '../article/Reader';
import Rejected from '../article/Rejected';
import Review from '../article/Review';
import Login from '../auth/Login/';
import Logout from '../auth/Logout/';
import ConnectingSplash from './ConnectingSplash';
import About from './About';
import Announcements from './Announcements';
import FAQ from './FAQ/';
import Sidebar from './Sidebar/';
import Header from './Header/';
import Footer from './Footer';

class App extends React.Component {
  previousLocation = this.props.location;

  showNewConnectionStatus = (network) => {
    new Notification('Connection Established', {
      body: `Connected to ${network} network`,
    });
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.connecting && !this.props.connecting) {
      this.showNewConnectionStatus(this.props.network);
    }
  }

  componentDidMount() {
    this.props.connectToBlockchain();
  }

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const {
      classes,
      connecting,
      footerHeight,
      headerHeight,
      history,
      location,
      sidebarWidth,
    } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );
    return (
      <ConnectingSplash connecting={connecting}>
        <TwoColumn sidebarWidth={sidebarWidth}>
          <Sidebar />
          <React.Fragment>
            <Header height={headerHeight} />
            <div className={classes.container}>
              <Switch location={isModal ? this.previousLocation : location}>
                <Route exact path="/logout" component={Logout} />
                <Route path="/draft" component={Draft} />
                <Route exact path="/edit/:id" component={Editor} />
                <Route exact path="/article/:title" component={Reader} />
                <Route exact path="/proposed/:id" component={Proposal} />
                <Route exact path="/rejected/:id" component={Rejected} />
                <Route exact path="/review/:proposalId/:title" component={Review} />
                <Route exact path="/articles" component={Articles} />
                <Route exact path="/articles/unreviewed" component={() => <div>Peer Review</div>} />
                <Route exact path="/tagging" component={() => <div>Tagging</div>} />
                <Route exact path="/writing-manual" component={() => <div>Writing Manual</div>} />
                <Route exact path="/advertising" component={() => <div>Advertising</div>} />
                <Route exact path="/about" component={About} />
                <Route exact path="/faq" component={FAQ} />
                <Route exact path="/announcements" component={Announcements} />
                <Route exact path="/transactions" component={() => <div>transactions</div>} />
                <Route
                  exact
                  path="/wallet"
                  component={() => <div>user info and wallet goes here</div>}
                />
                <Route component={Feed} />
              </Switch>
              {isModal && (
                <React.Fragment>
                  <Route
                    path="/login"
                    render={() => (
                      <Modal isOpen={true} onRequestClose={history.goBack} fullSize>
                        <Login />
                      </Modal>
                    )}
                  />
                </React.Fragment>
              )}
            </div>
            <Footer height={footerHeight} />
          </React.Fragment>
        </TwoColumn>
      </ConnectingSplash>
    );
  }
}

const mapStateToProps = ({
  app: { connecting, footerHeight, headerHeight, initializingContracts, network, sidebarWidth },
}) => ({
  connecting,
  footerHeight,
  headerHeight,
  initializingContracts,
  network,
  sidebarWidth,
});

const mapDispatchToProps = {
  connectToBlockchain,
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.colors.lightGray,
  },
});

export default withRouter(
  injectIntl(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(injectStyles(styles)(App))
  )
);
