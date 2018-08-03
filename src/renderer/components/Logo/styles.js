export default (theme) => ({
  container: ({ size }) => ({
    fontSize: size,
    textTransform: 'uppercase',
  }),
  image: {
    display: 'flex',
    flexShrink: 0,
    width: 35,
  },
  title: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    ...theme.typography.h1,
    fontSize: 'inherit',
    marginLeft: 10,
    color: theme.colors.white,
    fontWeight: 300,
  },
});
