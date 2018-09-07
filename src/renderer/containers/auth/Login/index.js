import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { Logo } from '../../../components';
import { getAccounts } from '../../../../shared/redux/modules/auth/actions';
import LoginForm from '../forms/LoginForm';
import CreateAccountForm from '../forms/CreateAccountForm';
//import ImportSSForm from '../forms/ImportSSForm';
import ImportAPIForm from '../forms/ImportAPIForm';
import styles from './styles';

const LoginView = ({ classes, onToggleView }) => (
  <React.Fragment>
    <header className={classes.header}>
      <h1 className={classes.title}>
        <FormattedMessage id="login_title" defaultMessage="Log In" />
      </h1>
      <div className={classes.help__container}>
        <span className={classes.help}>
          <FormattedMessage id="signup_help" defaultMessage="Do not have an account?" />
        </span>
        <a className={classes.help__link} onClick={onToggleView}>
          <FormattedMessage id="signup_action" defaultMessage="Create One Now" />
        </a>
      </div>
    </header>
    <LoginForm />
  </React.Fragment>
);

const CreateAccountView = ({ classes, showAPIImport }) => (
  <React.Fragment>
    <header className={classes.header}>
      <h1 className={classes.title}>
        <FormattedMessage id="create_account_title" defaultMessage="Create New Account" />
      </h1>
      <div className={classes.help__container}>
        <span className={classes.help}>
          <FormattedMessage id="login_help" defaultMessage="Already have an account?" />
        </span>
        <a className={classes.help__link} onClick={showAPIImport}>
          <FormattedMessage id="import_link" defaultMessage="Import an Account" />
        </a>
      </div>
    </header>
    <CreateAccountForm />
  </React.Fragment>
);

const ImportAPIAccountView = ({ classes, onToggleView }) => (
  <React.Fragment>
    <header className={classes.header}>
      <h1 className={classes.title}>
        <FormattedMessage
          id="import_api_account_title"
          defaultMessage="Import Your Lunyr Account"
        />
      </h1>
      <div className={classes.help__container}>
        <span className={classes.help}>
          <FormattedMessage
            id="import_help"
            defaultMessage="Have an account from an Ethereum client?"
          />
        </span>
        <a className={classes.help__link} onClick={onToggleView}>
          <FormattedMessage
            id="import_secretstore_link"
            defaultMessage="Import an account from a Secret Store file"
          />
        </a>
      </div>
    </header>
    <ImportAPIForm />
  </React.Fragment>
);

/*const ImportSSAccountView = ({ classes, onToggleView }) => (
  <React.Fragment>
    <header className={classes.header}>
      <h1 className={classes.title}>
        <FormattedMessage id="import_ss_account_title" defaultMessage="Import Your Lunyr Account" />
      </h1>
      <div className={classes.help__container}>
        <span className={classes.help}>
          <FormattedMessage id="import_api_help" defaultMessage="Have an account from lunyr.com?" />
        </span>
        <a className={classes.help__link} onClick={onToggleView}>
          <FormattedMessage id="import_api_link" defaultMessage="Import an account from lunyr.com" />
        </a>
      </div>
    </header>
    <ImportSSForm />
  </React.Fragment>
);*/

class Login extends React.Component {
  state = {
    showingLogin: true,
    showingAPIImport: false,
  };

  toggleShowing = (e) => {
    e.preventDefault();
    this.setState(({ showingLogin }) => ({
      showingLogin: !showingLogin,
    }));
  };

  showAPIImport = (e) => {
    e.preventDefault();
    this.setState(() => ({
      showingLogin: false,
      showingAPIImport: true,
    }));
  };

  componentDidMount() {
    this.props.getAccounts();
  }

  render() {
    const { classes, accounts } = this.props;
    const { showingLogin, showingAPIImport } = this.state;

    let view = (
      <CreateAccountView
        classes={classes}
        onToggleView={this.toggleShowing}
        showAPIImport={this.showAPIImport}
      />
    );
    
    if (showingLogin && accounts && accounts.length > 0) {
      view = <LoginView classes={classes} onToggleView={this.toggleShowing} />;
    } else if (showingAPIImport) {
      view = <ImportAPIAccountView classes={classes} onToggleView={this.toggleShowing} />;
    }

    return (
      <div className={classes.container}>
        <Logo className={classes.logo} hasTitle={true} />
        {view}
      </div>
    );
  }
}

const mapStateToProps = ({ auth: { accounts, isGettingAccounts, error } }) => ({
  accounts,
  error,
  isGettingAccounts,
});

const mapDispatchToProps = {
  getAccounts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(Login));
