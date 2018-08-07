export default theme => ({
  container: {
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
});
