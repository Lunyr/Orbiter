export default (theme) => ({
  nav: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'column',
    height: 'auto',
    width: 'auto',
    marginBottom: theme.spacing * 0.5,
    marginTop: theme.spacing * 0.5,
    paddingLeft: theme.spacing,
  },
  headerLink: {
    textDecoration: 'none',
  },
  title: {
    ...theme.typography.h1,
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 400,
    marginTop: theme.spacing * 0.5,
    marginBottom: theme.spacing * 0.5,
    textTransform: 'uppercase',
  },
  list: {
    padding: 0,
    margin: 0,
  },
  horizontal: {
    display: 'inline-flex',
    flexDirection: 'row',
  },
  horizontal__item: {
    marginRight: theme.spacing * 2,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 32,
  },
  navLinkIcon: {
    display: 'none',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 25,
    color: 'inherit',
  },
  display: {
    color: 'inherit',
  },
  link: {
    ...theme.typography.body,
    display: 'inline-flex',
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    fontWeight: 300,
    '&:hover': {
      color: theme.colors.white,
    },
  },
  active: {
    color: theme.colors.white,
  },
});
