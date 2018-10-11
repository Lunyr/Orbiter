import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import { toast } from 'react-toastify';
import size from 'lodash/size';
import { connectToBlockchain, closeSidebar } from '../../../shared/redux/modules/app/actions';
import { fetchAccountInformation } from '../../../shared/redux/modules/wallet/actions';
import { TwoColumn, Notifications } from '../../components';
import Advertising from '../advertising/';
import Articles from '../article/Articles';
import Drafts from '../article/Drafts';
import Draft from '../article/Draft';
import Feed from '../feed/Feed';
import PeerReview from '../review/';
import Proposal from '../article/Proposal';
import Reader from '../article/Reader';
import Rejected from '../article/Rejected';
import Review from '../article/Review';
import Tagging from '../tagging/';
import Login from '../auth/Login/';
import Logout from '../auth/Logout/';
import Wallet from '../wallet/';
import ConnectingSplash from './ConnectingSplash';
import About from './About';
import Announcements from './Announcements';
import FAQ from './FAQ/';
import Sidebar from './Sidebar/';
import Header from './Header/';
import Footer from './Footer/';

class App extends React.Component {
  previousLocation = this.props.location;

  showNewConnectionStatus = (network) => {
    new Notification('Connection Established', {
      body: `Connected to ${network} network`,
    });
  };

  handleLoadingAccountInformation = (account, connected) => {
    if (account && connected) {
      console.info('Fetching new user account information', account);
      this.props.fetchAccountInformation(account);
    }
  };

  handleNewConnectionEstablished = () => {
    this.showNewConnectionStatus(this.props.network);
    this.handleLoadingAccountInformation(this.props.account, true);
  };

  componentDidUpdate(prevProps) {
    // Fresh connectione established
    if (prevProps.connecting && !this.props.connecting) {
      this.handleNewConnectionEstablished();
    }

    // User changed accounts
    if (this.props.account !== prevProps.account) {
      // Logged in or changed user
      this.props.history.replace('/');
      this.handleLoadingAccountInformation(this.props.account, true);
    }

    // Show a users accounts increased
    if (size(this.props.accounts) !== size(prevProps.accounts)) {
      const moreAccounts = size(prevProps.accounts) < size(this.props.accounts);
      if (moreAccounts) {
        toast.info('New accounts were recently added.');
      }
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
      location,
      closeSidebar,
      sidebarWidth,
      sideBarOpened,
    } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );
    return (
      <ConnectingSplash connecting={connecting}>
        <TwoColumn sidebarWidth={sidebarWidth} isOpened={sideBarOpened} onToggle={closeSidebar}>
          <Sidebar />
          <React.Fragment>
            <Header height={headerHeight} />
            <div className={classes.container}>
              <Switch location={isModal ? this.previousLocation : location}>
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/drafts" component={Drafts} />
                <Route path="/draft" component={Draft} />
                <Route exact path="/article/:title" component={Reader} />
                <Route exact path="/proposed/:id" component={Proposal} />
                <Route exact path="/rejected/:id" component={Rejected} />
                <Route exact path="/review/:proposalId/:title" component={Review} />
                <Route exact path="/articles" component={Articles} />
                <Route exact path="/articles/unreviewed" component={PeerReview} />
                <Route exact path="/tagging" component={Tagging} />
                <Route exact path="/advertising" component={Advertising} />
                <Route exact path="/about" component={About} />
                <Route exact path="/faq" component={FAQ} />
                <Route exact path="/announcements" component={Announcements} />
                <Route exact path="/transactions" component={() => <div>transactions</div>} />
                <Route exact path="/wallet" component={Wallet} />
                <Route component={Feed} />
              </Switch>
            </div>
            <Footer height={footerHeight} />
          </React.Fragment>
        </TwoColumn>
        <Notifications position={toast.POSITION.BOTTOM_CENTER} />
      </ConnectingSplash>
    );
  }
}

const mapStateToProps = ({
  auth: { account, accounts },
  app: {
    connecting,
    connected,
    footerHeight,
    headerHeight,
    initializingContracts,
    network,
    sideBarOpened,
    sidebarWidth,
  },
}) => ({
  account,
  accounts,
  connecting,
  connected,
  footerHeight,
  headerHeight,
  initializingContracts,
  network,
  sideBarOpened,
  sidebarWidth,
});

const mapDispatchToProps = {
  connectToBlockchain,
  closeSidebar,
  fetchAccountInformation,
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
