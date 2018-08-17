export default (theme) => ({
  container: ({ height }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
    backgroundColor: theme.colors.white,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
  }),
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 35,
  },
  avatar: {
    marginRight: theme.spacing * 0.75,
  },
  write: {
    marginRight: theme.spacing,
    borderRadius: 30,
  },
});
