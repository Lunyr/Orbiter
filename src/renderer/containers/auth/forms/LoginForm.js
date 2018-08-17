import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ethjsAccount from 'ethjs-account';
import { login } from '../../../../shared/redux/modules/auth/actions';
import { ButtonGroup, Forms, LoadingIndicator } from '../../../components';

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
  submit = async ({ username, password }) => {
    try {
      const { login, reset } = this.props;
      const web3 = remote.getGlobal('web3');
      const privateKey = web3.utils.sha3(`${password}.${username}`);
      const userAddress = ethjsAccount.privateToAccount(privateKey).address;
      login({
        address: userAddress,
      });
      reset();
    } catch (error) {
      throw new SubmissionError({
        _error: error.message,
      });
    }
  };

  render() {
    const { classes, error, handleSubmit, history, intl, submitting } = this.props;
    return (
      <Form className={classes.form} onSubmit={handleSubmit(this.submit)}>
        <ErrorBlock error={error} />
        <LoadingIndicator fadeIn="quarter" showing={submitting} full />
        <Fieldset disabled={submitting}>
          <Group className={classes.group}>
            <Label
              className={classes.label}
              htmlFor="username"
              required={true}
              value={intl.formatMessage({ id: 'username', defaultMessage: 'Username' })}
            />
            <Field
              autoComplete="username"
              name="username"
              className={classes.input}
              component={InputField}
              type="username"
              required={true}
            />
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
  error: '',
  submitting: false,
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

const mapDispatchToProps = {
  login,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(
    reduxForm({
      form: 'forms.login',
    })(injectIntl(injectStyles(styles)(LoginForm)))
  )
);
