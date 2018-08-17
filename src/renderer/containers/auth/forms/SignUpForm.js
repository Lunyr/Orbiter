import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ethjsAccount from 'ethjs-account';
import { ButtonGroup, Forms, LoadingIndicator } from '../../../components';
import { registered } from '../../../../shared/redux/modules/auth/actions';

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

class SignUpForm extends React.Component {
  submit = async ({ username, password }) => {
    try {
      const { history, reset, registered } = this.props;
      const web3 = remote.getGlobal('web3');
      const privateKey = web3.utils.sha3(`${password}.${username}`);
      const hashedPassword = web3.utils.sha3(password);
      const userAddress = ethjsAccount.privateToAccount(privateKey).address;

      // Register the user
      registered({
        address: userAddress,
        username,
        password: hashedPassword,
      });

      reset();
  
      history.replace('/');
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
          <Group className={classes.group}>
            <Label
              className={classes.label}
              htmlFor="confirmPassword"
              required={true}
              value={intl.formatMessage({
                id: 'confirmPassword',
                defaultMessage: 'Confirm Password',
              })}
            />
            <Field
              autoComplete="confirmPassword"
              name="confirmPassword"
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
              value={intl.formatMessage({ id: 'signup-button', defaultMessage: 'Sign Up' })}
            />
          </ButtonGroup>
        </Footer>
      </Form>
    );
  }
}

SignUpForm.defaultProps = {
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

const validate = ({ password, confirmPassword }) => {
  const errors = {};
  if (password && confirmPassword && confirmPassword !== password) {
    errors.confirmPassword = 'Confirmed password does not match';
  }
  return errors;
};

const mapDispatchToProps = {
  registered,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(
    reduxForm({
      form: 'forms.sign-up',
      validate,
    })(injectIntl(injectStyles(styles)(SignUpForm)))
  )
);
