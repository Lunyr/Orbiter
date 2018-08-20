export default (theme) => ({
  container: {
    display: 'flex',
    border: 'none',
    outline: 'none',
    resize: 'none',
    ...theme.typography.h1,
    fontSize: '1.5rem',
    flexGrow: 1,
  },
});
