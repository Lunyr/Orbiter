export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.darkerGray,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: 70,
    backgroundColor: theme.colors.darkestGray,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
  },
  name: {
    ...theme.typography.h1,
    color: theme.colors.white,
    fontWeight: 300,
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    flexGrow: 1,
  },
  version: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: 300,
  },
});
