export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: 'auto',
  },
  full: {
    display: 'flex',
    height: '100%',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 1000,
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.primary,
  },
  hidden: {
    display: 'none',
  },
  text: {
    ...theme.typography.h2,
    color: 'inherit',
    marginBottom: theme.spacing,
    fontSize: '1.4rem',
  },
});
