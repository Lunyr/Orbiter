import React from 'react';
import injectStyles from 'react-jss';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
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
  submit = (values) => {
    console.log('submitted login form here', values);
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

export default withRouter(
  reduxForm({
    form: 'forms.login',
  })(injectIntl(injectStyles(styles)(LoginForm)))
);
