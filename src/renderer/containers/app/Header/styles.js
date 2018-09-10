export default (theme) => ({
  container: ({ height }) => ({
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
    backgroundColor: theme.colors.white,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
  }),
  header__item: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 45,
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 45,
    width: '100%',
  },
  avatar: {
    marginRight: theme.spacing * 0.75,
  },
  write: {
    marginRight: theme.spacing,
  },
  account: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 'auto',
    paddingLeft: 0,
    width: '100%',
    textDecoration: 'none',
  },
  link: {
    color: theme.colors.gray,
    textDecoration: 'none',
    '&:hover': {
      color: theme.colors.link,
    },
  },
  padded: {
    paddingLeft: theme.spacing,
  },
  logout: {
    borderBottom: 'none',
  },
});
