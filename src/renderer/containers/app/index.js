import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import Loadable from 'react-loadable';
import { AsyncLoader, Modal, TwoColumn } from '../../components';
import ConnectingSplash from './ConnectingSplash';
import Feed from '../feed';
import Sidebar from './Sidebar/';
import Header from './Header/';
import Footer from './Footer';
import { connectToBlockchain } from '../../../shared/redux/modules/app/actions';

const Draft = Loadable({
  loader: () => import('../article/Draft'),
  loading: AsyncLoader,
});

const Login = Loadable({
  loader: () => import('../auth/Login/'),
  loading: AsyncLoader,
});

const Logout = Loadable({
  loader: () => import('../auth/Logout/'),
  loading: AsyncLoader,
});

class App extends React.Component {
  previousLocation = this.props.location;

  showNewConnectionStatus = (network) => {
    new Notification('Connection Established', {
      body: `Connected to ${network} network`,
    });
  };

  async componentDidUpdate(prevProps) {
    const web3 = remote.getGlobal('web3');
    if (!prevProps.connecting && this.props.connecting && web3) {
      const network = await web3.eth.net.getNetworkType();
      this.showNewConnectionStatus(network);
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
                <Route exact path="/articles/unreviewed" component={() => <div>Peer Review</div>} />
                <Route exact path="/tagging" component={() => <div>Tagging</div>} />
                <Route exact path="/writing-manual" component={() => <div>Writing Manual</div>} />
                <Route exact path="/advertising" component={() => <div>Advertising</div>} />
                <Route exact path="/about" component={() => <div>About</div>} />
                <Route exact path="/faq" component={() => <div>FAQ</div>} />
                <Route exact path="/announcements" component={() => <div>Announcements</div>} />
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

const mapStateToProps = ({ app: { connecting, footerHeight, headerHeight, sidebarWidth } }) => ({
  connecting,
  footerHeight,
  headerHeight,
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
