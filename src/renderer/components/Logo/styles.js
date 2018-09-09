export default (theme) => ({
  container: ({ size }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: size,
  }),
  image: ({ size }) => ({
    display: 'flex',
    flexShrink: 0,
    width: size * 1.25,
  }),
  title: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    ...theme.typography.h1,
    fontSize: 'inherit',
    marginLeft: theme.spacing * 0.75,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 300,
  },
});
