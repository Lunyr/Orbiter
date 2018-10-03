export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    height: '100%',
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
  },
  header__title: {
    ...theme.typography.h1,
    fontSize: '1.5rem',
    marginBottom: 0,
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
  content: {
    height: `calc(100% - ${theme.spacing}px)`,
    width: '100%',
    display: 'inline-flex',
    flexGrow: 1,
    borderTop: '1px solid rgba(0,0,0,0.1)',
    marginTop: theme.spacing,
  },
  button: {
    ...theme.buttons.success,
    borderRadius: 24,
    minWidth: 200,
  },
});
