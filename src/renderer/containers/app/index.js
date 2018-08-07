import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import Loadable from 'react-loadable';
import { AsyncLoader, Modal, TwoColumn } from '../../components';
import Sidebar from './Sidebar/';
import Header from './Header/';
import Footer from './Footer';

const Login = Loadable({
  loader: () => import('../auth/Login/'),
  loading: AsyncLoader,
});

class App extends React.Component {
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { classes, footerHeight, headerHeight, history, location, sidebarWidth } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );
    return (
      <TwoColumn sidebarWidth={sidebarWidth}>
        <Sidebar />
        <React.Fragment>
          <Header height={headerHeight} />
          <div className={classes.container}>
            <Switch location={isModal ? location : this.previousLocation}>
              <Route exact path="/articles/unreviewed" component={() => <div>Peer Review</div>} />
              <Route exact path="/tagging" component={() => <div>Tagging</div>} />
              <Route exact path="/writing-manual" component={() => <div>Writing Manual</div>} />
              <Route exact path="/advertising" component={() => <div>Advertising</div>} />
              <Route exact path="/about" component={() => <div>About</div>} />
              <Route exact path="/faq" component={() => <div>FAQ</div>} />
              <Route exact path="/announcements" component={() => <div>Announcements</div>} />
              <Route component={() => <div>Feed Here</div>} />
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
    );
  }
}

const mapStateToProps = ({ app: { footerHeight, headerHeight, sidebarWidth } }) => ({
  footerHeight,
  headerHeight,
  sidebarWidth,
});

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing,
  },
});

export default injectIntl(connect(mapStateToProps)(injectStyles(styles)(App)));
