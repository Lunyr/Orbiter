export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    marginTop: theme.spacing,
    marginBottom: theme.spacing,
    padding: theme.spacing,
  },
  title: {
    ...theme.typography.h2,
    margin: 0,
    fontSize: '1.1rem',
    borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
  },
});
