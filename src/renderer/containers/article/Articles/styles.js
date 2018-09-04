export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    flexShrink: 0,
  },
  title: {
    ...theme.typography.h1,
    fontSize: '1.5rem',
  },
  numberOfArticles: {
    ...theme.typography.body,
    fontSize: '1.25rem',
    color: theme.colors.gray,
    marginLeft: theme.spacing * 0.5,
  },
});
