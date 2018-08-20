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
    boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
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
