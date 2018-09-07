import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ethjsAccount from 'ethjs-account';
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
    const { classes, accountsError, loginError, handleSubmit, history, intl, submitting, accounts, loading } = this.props;
    const accountRadios = accounts ? accounts.map((a) => 
      <div key={a.address}>
        <Field
          name="account"
          className={classes.input}
          component={InputField}
          type="radio"
          id={a.address}
          value={a.address}
          required={true}
        />
        <Label
          className={classes.label}
          htmlFor={a.address}
          required={true}
          value={<span><Avatar seed={a.address} /><span>{a.address}</span></span>}
        />
      </div>
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
              value={intl.formatMessage({ id: 'choose-account', defaultMessage: 'Select an account' })}
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
              type="text"
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
  group: {
    marginBottom: theme.spacing,
  },
  footer: {
    marginTop: theme.spacing,
  },
  cancel: {
    color: theme.colors.white,
  },
});

const mapStateToProps = ({ auth: { accounts, loginError, accountsError } }) => ({
  accounts,
  loginError,
  accountsError,
});

const mapDispatchToProps = {
  login,
};

LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);

export default withRouter(
  reduxForm({
    form: 'forms.login',
  })(injectIntl(injectStyles(styles)(LoginForm)))
);
