export default (theme) => ({
  contributors: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'inherit',
    height: 60,
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  userImage: {
    height: 75,
    width: 75,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  link: {
    textDecoration: 'none',
  },
  tagLine: {
    ...theme.typography.h3,
    fontWeight: 400,
    fontSize: '1.45rem',
    margin: 0,
  },
  contributor: {
    fontSize: '1rem',
    marginRight: theme.spacing,
    textAlign: 'center',
  },
  avatars: {
    display: 'flex',
    overflowX: 'auto',
    maxWidth: '50vw',
  },
});
