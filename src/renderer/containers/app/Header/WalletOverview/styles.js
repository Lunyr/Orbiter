export default (theme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: theme.colors.lightestGray,
    padding: theme.spacing,
    width: `calc(100% - ${theme.spacing * 2}px)`,
    '&:hover': {
      backgroundColor: theme.colors.lightGray,
    },
  },
  header: {
    ...theme.typography.small,
    ...theme.overflow,
    marginTop: theme.spacing,
    textTransform: 'uppercase',
    color: theme.colors.primary,
    fontWeight: 600,
  },
  header__address: {
    marginTop: 0,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    ...theme.overflow,
    height: 35,
    alignItems: 'center',
    ...theme.typography.body,
    fontWeight: 400,
  },
  value: {
    marginLeft: theme.spacing,
  },
  address: {
    wordBreak: 'break-all',
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});
