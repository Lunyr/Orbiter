export default (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexGrow: 1,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.h2,
    fontSize: '1.2rem',
    fontWeight: 300,
  },
});
