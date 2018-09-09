import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { LoadingIndicator, Logo } from '../../../components';
import { logout } from '../../../../shared/redux/modules/auth/actions';
import styles from './styles';

class Logout extends React.Component {
  componentDidMount() {
    setTimeout(this.props.onLogout, 500);
  }

  render() {
    const { classes, isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div className={classes.container}>
        <Logo hasTitle={false} size={50} />
        <h1 className={classes.title}>
          <FormattedMessage id="logout-title" defaultMessage="Logging out..." />
        </h1>
        <LoadingIndicator
          id="logout-loading-indicator"
          className={classes.loader}
          fadeIn="quarter"
          showing={true}
        />
        <p className={classes.help}>
          <FormattedMessage
            id="logout-redirect-text"
            defaultMessage="You will be redirected back to the home page shortly."
          />
        </p>
      </div>
    );
  }
}

const mapStateToProps = ({ auth: { isLoggedIn } }) => ({
  isLoggedIn,
});

const mapDispatchToProps = {
  onLogout: logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(Logout));
