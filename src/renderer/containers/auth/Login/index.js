import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { Logo } from '../../../components';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';
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
          <FormattedMessage id="signup_action" defaultMessage="Sign Up Now" />
        </a>
      </div>
    </header>
    <LoginForm />
  </React.Fragment>
);

const SignUpView = ({ classes, onToggleView }) => (
  <React.Fragment>
    <header className={classes.header}>
      <h1 className={classes.title}>
        <FormattedMessage id="signup_title" defaultMessage="Sign Up" />
      </h1>
      <div className={classes.help__container}>
        <span className={classes.help}>
          <FormattedMessage id="login_help" defaultMessage="Already have an account?" />
        </span>
        <a className={classes.help__link} onClick={onToggleView}>
          <FormattedMessage id="login_link" defaultMessage="Log In Now" />
        </a>
      </div>
    </header>
    <SignUpForm />
  </React.Fragment>
);

class Login extends React.Component {
  state = {
    showingLogin: true,
  };

  toggleShowing = (e) => {
    e.preventDefault();
    this.setState(({ showingLogin }) => ({
      showingLogin: !showingLogin,
    }));
  };

  render() {
    const { classes } = this.props;
    const { showingLogin } = this.state;
    return (
      <div className={classes.container}>
        <Logo hasTitle={true} />
        {showingLogin ? (
          <LoginView classes={classes} onToggleView={this.toggleShowing} />
        ) : (
          <SignUpView classes={classes} onToggleView={this.toggleShowing} />
        )}
      </div>
    );
  }
}

export default injectStyles(styles)(Login);
