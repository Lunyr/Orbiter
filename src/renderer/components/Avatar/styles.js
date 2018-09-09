export default theme => ({
  avatar: ({ size }) => ({
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    fontSize: 16,
    borderRadius: '50%',
    overflow: 'hidden',
    height: size,
    width: size,
  }),
  image: {
    objectFit: 'cover',
  },
});
