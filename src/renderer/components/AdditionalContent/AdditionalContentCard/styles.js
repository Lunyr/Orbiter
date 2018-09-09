export default (theme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    boxShadow: theme.boxShadows.medium,
  },
  video: {
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    objectFit: 'cover',
    height: 125,
  },
  caption: {
    padding: theme.spacing * 2,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    padding: theme.spacing * 0.5,
    backgroundColor: theme.colors.lightestGray,
  },
});
