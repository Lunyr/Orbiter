import React from 'react';

export default theme => ({
  ...theme.forms,
  plain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: 'transparent',
    opacity: 0.6,
    fontSize: '0.75rem',
    color: theme.colors.black,
    letterSpacing: 0.86,
    cursor: 'pointer',
    textDecoration: 'none',
    minWidth: 80,
    border: 'none',
    fontWeight: 400,
    transition: 'all 0.2s linear',
    '&:hover': {
      background: 'transparent',
      opacity: 1,
    },
  },
  fieldset__title: {
    ...theme.typography.h2,
    color: theme.colors.black,
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: theme.spacing * 2,
    marginTop: 0,
  },
  error: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginBottom: theme.spacing,
  },
  field: {
    height: 'auto',
    width: 'auto',
  },
  group: {
    ...theme.forms.group,
    width: '100%',
  },
  field__error: {
    display: 'block',
    ...theme.typography.body,
    color: theme.colors.error,
    marginTop: 5,
    fontSize: '0.85rem',
  },
  field__warning: {
    display: 'block',
    ...theme.typography.body,
    color: theme.colors.warning,
    marginTop: 5,
    fontSize: '0.85rem',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing,
    justifyContent: 'flex-end',
  },
  inlineGroup: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  inlineGroup__item: ({ children }) => ({
    width: `${100 / React.Children.count(children)}%`,
  }),
  inlineGroup__inner: {
    paddingRight: theme.spacing,
    width: `calc(100% - ${theme.spacing}px)`,
  },
  noPadding: {
    paddingRight: '0 !important',
    width: '100%',
    height: '100%',
  },
});
