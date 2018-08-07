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
    justifyConten: 'flex-end',
  },
});
