export default (theme) => ({
  entryHeader: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing,
  },
  title: {
    ...theme.typography.header,
    fontWeight: 400,
    fontSize: 22,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    textDecoration: 'none',
  },
  entryHeader__username: {
    fontWeight: 600,
    color: 'rgba(53, 64, 82, 0.8)',
    marginRight: 6,
    textDecoration: 'none',
  },
  entryHeader__title: {
    ...theme.typography.header,
    fontSize: '1.1rem',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(53, 64, 82, 0.8)',
    margin: '0 0 5px 0',
  },
  entryHeader__meta: {
    ...theme.typography.help,
    display: 'inline-flex',
    color: 'rgba(53, 64, 82, 0.8)',
  },
  meta__updatedAt: {
    ...theme.typography.small,
    marginRight: theme.spacing,
    color: 'rgba(53, 64, 82, 0.6)',
    marginTop: 3,
  },
});
