export default (theme) => ({
  container: {
    border: 'none',
    outline: 'none',
    resize: 'none',
    ...theme.typography.h1,
    fontSize: '1.5rem',
  },
});
