import React from 'react';
import injectStyles from 'react-jss';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Forms, LoadingIndicator } from '../../../components';

const { ErrorBlock, Fieldset, Footer, Form, Group, InputField, Label, SubmitButton } = Forms;

class SignUpForm extends React.Component {
  submit = (values) => {
    console.log('submitted signup form here', values);
  };

  render() {
    const { classes, error, handleSubmit, intl, submitting } = this.props;
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
              type="confirmPassword"
              required={true}
            />
          </Group>
        </Fieldset>
        <Footer className={classes.footer}>
          <SubmitButton
            submitting={submitting}
            value={intl.formatMessage({ id: 'signup-button', defaultMessage: 'Sign Up' })}
          />
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
});

export default reduxForm({
  form: 'forms.sign-up',
})(injectIntl(injectStyles(styles)(SignUpForm)));
