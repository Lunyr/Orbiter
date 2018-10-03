export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    width: '100%',
    flexGrow: 1,
    overflow: 'auto',
  },
  inner: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 'auto',
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing * 2,
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    paddingTop: theme.spacing * 2,
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
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  content__grid: {
    display: 'flex',
    flexDirection: 'column',
  },
});
