import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import Button from '../buttons/Base';
import styles from './styles';
import AsyncSelectField from './AsyncSelectField';
import FieldError from './FieldError';
import SelectField from './SelectField';

const ActionButton = injectStyles(styles)(
  ({ id, classes, className, disabled, onClick, theme = 'base', type = 'button', value }) => (
    <Button
      id={id}
      theme={theme}
      type={type}
      className={cx(classes.plain, className)}
      onClick={onClick}
      value={value}
      disabled={disabled}
    />
  )
);

const ErrorBlock = injectStyles(styles)(
  ({ classes, className, error }) =>
    error ? <div className={cx(classes.error, className, 'ErrorBlock')}>{error}</div> : null
);

const Fieldset = injectStyles(styles)(
  ({ classes, children, className, disabled, title, titleClassName }) => (
    <fieldset className={cx(classes.fieldset, className)} disabled={disabled}>
      {title && <h2 className={cx(classes.fieldset__title, titleClassName)}>{title}</h2>}
      {children}
    </fieldset>
  )
);

const Footer = injectStyles(styles)(({ classes, children, className }) => (
  <div className={cx(classes.footer, className)}>{children}</div>
));

const Form = injectStyles(styles)(({ classes, children, className, id, onSubmit }) => (
  <form id={id} className={cx(classes.form, className)} onSubmit={onSubmit}>
    {children}
  </form>
));

const Group = injectStyles(styles)(({ classes, children, className }) => (
  <div className={cx(classes.group, className)}>{children}</div>
));

const InlineGroup = injectStyles(styles)(({ classes, children, className, innerClassName }) => {
  const childCount = React.Children.count(children) - 1;
  return (
    <div className={cx(classes.inlineGroup, className)}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={cx(classes.inlineGroup__item, innerClassName)}>
          <div
            className={cx(classes.inlineGroup__inner, index === childCount && classes.noPadding)}>
            {child}
          </div>
        </div>
      ))}
    </div>
  );
});

const InputField = injectStyles(styles)(
  ({ autoComplete, classes, className, id, input, label, type, meta, ...inputProps }) => (
    <div className={classes.field}>
      <input
        id={id}
        autoComplete={autoComplete}
        className={cx(classes.input, className)}
        {...input}
        placeholder={label}
        type={type}
        {...inputProps}
      />
      <FieldError {...meta} />
    </div>
  )
);

const Label = injectStyles(styles)(({ classes, className, htmlFor, required, srOnly, value }) => (
  <label className={cx(classes.label, className, srOnly && classes.srOnly)} htmlFor={htmlFor}>
    {value} {required && <span>*</span>}
  </label>
));

const SubmitButton = ({ id, className, disabled, submitting, value }) => (
  <Button
    id={id}
    className={className}
    disabled={disabled || submitting}
    theme="primary"
    value={submitting ? 'Processing...' : value}
  />
);

const TextAreaField = injectStyles(styles)(
  ({ classes, className, id, input, label, type, meta }) => (
    <div className={classes.field}>
      <textarea
        id={id}
        className={cx(classes.textarea, className)}
        {...input}
        placeholder={label}
      />
      <FieldError {...meta} />
    </div>
  )
);

export default {
  ActionButton,
  AsyncSelectField,
  ErrorBlock,
  FieldError,
  Fieldset,
  Footer,
  Form,
  Group,
  InputField,
  InlineGroup,
  Label,
  SelectField,
  SubmitButton,
  TextAreaField,
};
