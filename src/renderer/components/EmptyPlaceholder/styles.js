export default (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.h2,
    fontSize: '1.1rem',
    fontWeight: 300,
  },
});
