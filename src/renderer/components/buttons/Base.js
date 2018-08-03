import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';

const Base = ({ classes, className, disabled, onClick, theme, type, value, ...rest }) => (
  <button
    className={cx({
      [className]: className,
      [classes[theme]]: true,
      [classes.disabled]: disabled,
      [classes.core]: true,
    })}
    type={type}
    onClick={onClick}
    disabled={disabled}
    {...rest}>
    {value}
  </button>
);

Base.defaultProps = {
  disabled: false,
  theme: 'base',
  type: 'submit',
  value: '',
};

const styles = theme => ({
  core: {
    fontSize: '0.8rem',
    fontWeight: 400,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    textTransform: 'uppercase',
    minWidth: 100,
    whiteSpace: 'nowrap',
  },
  ...theme.buttons,
});

export default injectStyles(styles)(Base);
