export default (theme) => ({
  container: {
    display: 'flex',
    width: '100%',
  },
  header: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    backgroundColor: theme.colors.white,
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    paddingTop: theme.spacing,
    width: `calc(100% - ${theme.spacing * 4}px)`,
  },
  header__title: {
    ...theme.typography.h1,
    fontSize: '1.5rem',
    marginBottom: 0,
    marginTop: 0,
  },
  header__left: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header__help: {
    ...theme.typography.body,
    fontSize: '0.9rem',
    marginTop: 5,
    marginBottom: 0,
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    width: '100%',
  },
});
