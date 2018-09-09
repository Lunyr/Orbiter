import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { ButtonGroup, Forms, LoadingIndicator } from '../../../components';
import { importAPIAccount } from '../../../../shared/redux/modules/auth/actions';

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

class ImportAPIForm extends React.Component {
  submit = async ({ email, password }) => {
    try {
      const { reset, importAPIAccount } = this.props;
      importAPIAccount({
        email,
        password,
      });
      reset();
    } catch (error) {
      throw new SubmissionError({
        _error: error.message,
      });
    }
  };

  render() {
    const { classes, importError, handleSubmit, history, intl, submitting } = this.props;
    return (
      <Form className={classes.form} onSubmit={handleSubmit(this.submit)}>
        <ErrorBlock error={importError} />
        <LoadingIndicator fadeIn="quarter" showing={submitting} full />
        <Fieldset disabled={submitting}>
          <Group className={classes.group}>
            <Label
              className={classes.label}
              htmlFor="email"
              required={true}
              value={intl.formatMessage({ id: 'email', defaultMessage: 'E-mail' })}
            />
            <Field
              autoComplete="email"
              name="email"
              className={classes.input}
              component={InputField}
              type="email"
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
              value={intl.formatMessage({
                id: 'importaccount-button',
                defaultMessage: 'Authenticate & Import Account',
              })}
            />
          </ButtonGroup>
        </Footer>
      </Form>
    );
  }
}

ImportAPIForm.defaultProps = {
  classes: {},
  importError: '',
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

const mapStateToProps = ({ auth: { importError } }) => ({
  importError,
});

const mapDispatchToProps = {
  importAPIAccount,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(
    reduxForm({
      form: 'forms.import-api-account',
      validate,
    })(injectIntl(injectStyles(styles)(ImportAPIForm))),
  ),
);
