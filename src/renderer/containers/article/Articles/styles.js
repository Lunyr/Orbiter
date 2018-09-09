export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'auto',
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
    marginRight: theme.spacing,
  },
  numberOfArticles: {
    ...theme.typography.body,
    fontSize: '1.25rem',
    color: theme.colors.gray,
    marginLeft: theme.spacing * 0.5,
  },
  refresh: {
    position: 'relative',
    top: 2,
  },
});
