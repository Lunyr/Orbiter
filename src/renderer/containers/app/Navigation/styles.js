export default (theme) => ({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
    transition: '.5s ease-in-out',
    overflow: 'auto',
  },
  closer: {
    color: 'rgba(255, 255, 255, 0.5)',
    background: 'none',
    border: 'none',
    '&:hover:not(:disabled)': {
      color: theme.colors.white,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
    background: 'transparent',
    minHeight: 525,
    overflow: 'auto',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing * 0.5,
    flexShrink: 0,
    height: 70,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.7rem',
  },
  version: {
    ...theme.typography.body,
    color: theme.colors.white,
    margin: '5px 0 7px 0',
  },
  link: {
    ...theme.typography.body,
    color: 'rgba(255, 255, 255, 0.4)',
    textDecoration: 'none',
    marginBottom: 5,
    fontSize: 'inherit',
    '&:hover': {
      color: theme.colors.white,
    },
  },
  articleList: {
    marginBottom: 0,
    marginTop: 0,
  },
});
