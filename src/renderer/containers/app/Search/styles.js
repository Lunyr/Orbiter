export default (theme) => ({
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    border: 'none',
    borderRadius: theme.borderRadius,
  },
  form: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 2,
    minWidth: 275,
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    width: 30,
    height: '100%',
    backgroundColor: theme.colors.white,
  },
  offsetLeft: {
    paddingLeft: theme.spacing,
  },
  offsetRight: {
    paddingRight: theme.spacing,
  },
  searchIcon: {
    color: '#929397',
  },
  clearIcon: {
    color: '#DBDCE1',
    '&:hover': {
      color: '#929397',
    },
  },
  action__button: {
    background: 'none',
    border: 'none',
    height: '100%',
    width: '100%',
    padding: 0,
  },
  input__container: {
    display: 'flex',
    width: '100%',
  },
  input: {
    height: '100%',
    width: '100%',
    padding: '0 10px',
    border: 'none',
    outline: 'none',
    fontSize: '0.9rem',
  },
  srOnly: {
    ...theme.srOnly,
  },
  results: {
    display: 'none',
    position: 'absolute',
    left: 0,
    backgroundColor: theme.colors.white,
    minHeight: 100,
    boxShadow: theme.boxShadows.large,
    zIndex: 3,
    overflow: 'auto',
    maxWidth: 600,
  },
  results__detached: {
    display: 'block',
    position: 'relative',
    backgroundColor: theme.colors.white,
    height: 'calc(100% - 50px)',
    minHeight: 150,
    boxShadow: 'none',
    zIndex: 3,
    overflow: 'auto',
    maxWidth: '100%',
    minWidth: '100%',
    top: 0,
  },
  results__container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  results__container__detached: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
  },
  results__info: {
    display: 'flex',
    alignItems: 'center',
    height: 40,
    paddingLeft: theme.spacing,
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    ...theme.typography.label,
  },
  results__error: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    minWidth: '100%',
  },
  results__empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    minWidth: '100%',
  },
  empty__text: {
    ...theme.typography.body,
    fontSize: 20,
    marginTop: theme.spacing * 0.5,
    color: theme.colors.darkestGray,
    fontWeight: 300,
  },
  empty__icon: {
    color: theme.colors.darkestGray,
  },
  link: {
    textDecoration: 'none',
    color: '#000',
  },
  list: {
    maxHeight: 600,
  },
  articleLink: {
    height: 100,
  },
  result: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    height: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    width: `calc(100% - ${theme.spacing * 2}px)`,
    '&:hover': {
      background: theme.colors.lightGray,
    },
  },
  result__detached: {
    width: '100%',
  },
  result__text: {
    width: 530,
    '@media only screen and (max-width: 1024px)': {
      width: '100%',
    },
  },
  result__image: {
    display: 'flex',
    flexShrink: 0,
    width: 100,
    height: 75,
    marginRight: theme.spacing * 1.75,
    objectFit: 'cover',
    '@media only screen and (max-width: 1024px)': {
      marginRight: theme.spacing,
    },
  },
  result__title: {
    fontWeight: 600,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'normal',
    width: '100%',
    '@media only screen and (max-width: 1024px)': {
      paddingRight: 20,
      fontSize: 14,
    },
  },
  result__description: {
    height: 55,
    overflow: 'hidden',
    marginTop: 5,
    ...theme.typography.body,
    fontSize: 14,
    lineHeight: '18px',
    '@media only screen and (max-width: 1024px)': {
      paddingRight: 20,
      fontSize: 13,
    },
  },
  show: {
    display: 'block',
  },
  hidden: {
    display: 'none',
  },
  disabled: {
    ...theme.buttons.disabled,
  },
});
