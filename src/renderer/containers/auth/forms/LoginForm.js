import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import { login } from '../../../../shared/redux/modules/auth/actions';
import { ButtonGroup, Forms, LoadingIndicator, Avatar } from '../../../components';

const {
  ActionButton,
  ErrorBlock,
  Fieldset,
  Footer,
  Form,
  Group,
  InputField,
  Label,
  SubmitButton,
} = Forms;

class LoginForm extends React.Component {
  submit = async ({ account, password }) => {
    try {
      const { login, reset } = this.props;
      login({
        address: account,
        password: password,
      });
      reset();
    } catch (error) {
      throw new SubmissionError({
        _error: error.message,
      });
    }
  };

  render() {
    const {
      account,
      accounts,
      classes,
      accountsError,
      loginError,
      handleSubmit,
      history,
      loading,
      intl,
      submitting,
    } = this.props;
    const accountRadios = accounts ? (
      accounts.map((a) => {
        const isCurrentAccount = a.address === account;
        return (
          <div
            key={a.address}
            className={cx({
              [classes.radio__container]: true,
            })}>
            {!isCurrentAccount && (
              <Field
                name="account"
                className={classes.radio}
                component={InputField}
                type="radio"
                id={a.address}
                value={a.address}
                required={true}
                readOnly={isCurrentAccount}
              />
            )}
            <Label
              className={cx(
                classes.label,
                classes.accountLabel__label,
                isCurrentAccount && classes.padLeft
              )}
              htmlFor={a.address}
              value={
                <span className={classes.accountLabel}>
                  <Avatar className={classes.accountLabel__avatar} seed={a.address} />
                  <span className={classes.accountLabel__address}>
                    {isCurrentAccount ? `${a.address} (LOGGED IN)` : a.address}
                  </span>
                </span>
              }
            />
          </div>
        );
      })
    ) : (
      <div>loading...</div>
    );
    return (
      <Form className={classes.form} onSubmit={handleSubmit(this.submit)}>
        <ErrorBlock error={accountsError} />
        <ErrorBlock error={loginError} />
        <LoadingIndicator fadeIn="quarter" showing={loading || submitting} full />
        <Fieldset disabled={submitting}>
          <Group className={classes.group}>
            <Label
              className={classes.label}
              htmlFor="account"
              required={true}
              value={intl.formatMessage({
                id: 'choose-account',
                defaultMessage: 'Select an account',
              })}
            />
            {accountRadios}
          </Group>
          <Group className={classes.group}>
            <Label
              className={classes.label}
              htmlFor="password"
              required={true}
              value={intl.formatMessage({ id: 'password', defaultMessage: 'Password' })}
            />
            <Field
              autoComplete="password"
              name="password"
              className={classes.input}
              component={InputField}
              type="password"
              required={true}
            />
          </Group>
        </Fieldset>
        <Footer className={classes.footer}>
          <ButtonGroup>
            <ActionButton
              className={classes.cancel}
              type="button"
              onClick={history.goBack}
              value="Cancel"
            />
            <SubmitButton
              submitting={submitting}
              value={intl.formatMessage({ id: 'login-button', defaultMessage: 'Log In' })}
            />
          </ButtonGroup>
        </Footer>
      </Form>
    );
  }
}

LoginForm.defaultProps = {
  classes: {},
  accountsError: '',
  loginError: '',
  submitting: false,
  loading: false,
  accounts: [],
};

const styles = (theme) => ({
  form: {
    height: 450,
    width: 450,
    marginBottom: theme.spacing * 2,
  },
  label: {
    color: theme.colors.white,
  },
  input: {
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    border: 'none',
    boxShadow: 'none',
    height: 48,
  },
  radio__container: {
    display: 'inline-flex',
    height: 75,
    alignItems: 'center',
  },
  radio: {
    display: 'flex',
  },
  group: {
    marginBottom: theme.spacing,
  },
  footer: {
    marginTop: theme.spacing,
  },
  cancel: {
    color: theme.colors.white,
  },
  accountLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    ...theme.overflow,
  },
  accountLabel__label: {
    marginLeft: theme.spacing,
  },
  accountLabel__avatar: {
    marginLeft: theme.spacing * 0.5,
    marginRight: theme.spacing,
  },
  accountLabel__address: {
    ...theme.overflow,
  },
  disabled: {
    ...theme.forms.disabled,
  },
  padLeft: {
    marginLeft: 22,
  },
});

const mapStateToProps = ({ auth: { account, accounts, loginError, accountsError } }) => ({
  account,
  accounts,
  loginError,
  accountsError,
});

const mapDispatchToProps = {
  login,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({
      form: 'forms.login',
    })(injectIntl(injectStyles(styles)(LoginForm)))
  )
);
