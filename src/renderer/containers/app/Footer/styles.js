export default (theme) => ({
  container: ({ height }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    flexShrink: 0,
    height,
    backgroundColor: theme.colors.lightGray,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  }),
  license: {
    opacity: 0.7,
    marginBottom: 3,
    fontSize: '0.75rem',
  },
  license__link: {
    marginLeft: 3,
    marginRight: 3,
  },
  list: {
    display: 'inline-flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexShrink: 1,
    width: '100%',
    justifyContent: 'center',
  },
  item: {
    marginLeft: theme.spacing * 1.25,
    marginRight: theme.spacing * 1.25,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBDCE1',
    height: 34,
    width: 34,
    borderRadius: '50%',
  },
  icon: {
    color: theme.colors.white,
  },
  hidden: {
    display: 'none',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    width: `calc(100% - ${theme.spacing * 2}px)`,
    color: theme.colors.white,
    borderRadius: 6,
  },
});
