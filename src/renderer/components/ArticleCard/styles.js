export default (theme) => ({
  container: {
    flexGrow: 1,
    overflow: 'auto',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%',
    minWidth: 325,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius,
    zIndex: 1,
    '&:hover': {
      boxShadow: theme.boxShadows.small,
    },
  },
  image: {
    height: 175,
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing,
  },
  info__header: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    ...theme.typography.h2,
    fontSize: '1.25rem',
    fontWeight: 400,
    ...theme.overflow,
    flexShrink: 0,
    margin: 0,
    padding: 0,
  },
  timestamp: {
    ...theme.typography.small,
    display: 'block',
    marginTop: 5,
    color: theme.colors.gray,
  },
  help: {
    ...theme.typography.body,
    fontWeight: 400,
    lineHeight: '24px',
    maxHeight: 120,
    marginBottom: 0,
    overflow: 'hidden',
  },
});
