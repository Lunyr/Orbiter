export default (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: theme.colors.darkestGray,
    color: theme.colors.white,
    height: '100%',
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing * 2,
    color: theme.colors.white,
  },
  title: {
    ...theme.typography.h1,
    fontSize: 32,
    color: theme.colors.white,
    marginBottom: theme.spacing,
    fontWeight: 300,
  },
  help__container: {
    maxWidth: 320,
    textAlign: 'center',
  },
  help: {
    ...theme.typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  help__link: {
    ...theme.typography.body,
    color: theme.colors.white,
    marginLeft: 10,
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  logo: {
    marginRight: theme.spacing,
    marginBottom: theme.spacing,
  },
});
