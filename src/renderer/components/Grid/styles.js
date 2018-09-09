export default (theme) => ({
  container: {
    flexGrow: 1,
    overflow: 'auto',
  },
  grid: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  grid__item: {
    maxWidth: 300,
    height: 375,
    padding: 10,
    transition: 'transform 0.15s linear, box-shadow 0.15s linear',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '@media only screen and (max-width: 900px)': {
      maxWidth: '50%',
    },
  },
  grid__inner: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    boxShadow: theme.boxShadows.small,
    overflow: 'hidden',
    height: '100%',
  },
  item: {
    display: 'flex',
  },
});
