export default (theme) => ({
  contributors: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'inherit',
    height: 60,
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    '@media only screen and (max-width: 480px)': {
      display: 'none',
    },
  },
  userImage: {
    height: '75px',
    width: '75px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  link: {
    textDecoration: 'none',
  },
  tagLine: {
    ...theme.typography.h3,
    fontWeight: 500,
    fontSize: 24,
  },
  contributor: {
    fontSize: '16px',
    marginRight: '15px',
    textAlign: 'center',
  },
  avatars: {
    display: 'flex',
    overflowX: 'auto',
    maxWidth: '50vw',
  },
});
