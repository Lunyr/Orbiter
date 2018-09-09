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
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 35,
  },
  avatar: {
    marginRight: theme.spacing * 0.75,
  },
  write: {
    marginRight: theme.spacing,
    borderRadius: 30,
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
});
