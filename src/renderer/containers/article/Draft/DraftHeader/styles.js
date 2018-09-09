export default (theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  info: {
    display: 'inline-flex',
    height: '100%',
    alignItems: 'center',
  },
  info__label: {
    ...theme.typography.body,
    margin: 0,
    fontSize: '0.9rem',
    color: 'rgba(0, 0, 0, 0.3)',
    fontWeight: 400,
    marginRight: 10,
    textTransform: 'uppercase',
  },
  info__stacked: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.colors.darkGray,
  },
  uuid: {
    ...theme.typography.body,
    margin: 0,
    fontSize: '0.9rem',
    color: theme.colors.gray,
    fontWeight: 400,
  },
  saved: {
    ...theme.typography.body,
    color: 'rgba(0, 0, 0, 0.4)',
    fontStyle: 'italic',
    margin: 0,
    marginLeft: theme.spacing,
  },
  cancel: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: 400,
    '&:hover': {
      color: theme.colors.black,
    },
  },
  timestamp: {
    ...theme.typography.small,
    marginTop: 5,
    marginBottom: 0,
    color: 'rgba(0, 0, 0, 0.3)',
    fontStyle: 'italic',
  },
  toast__hash: {
    width: 550,
  },
  etherscan: {
    display: 'flex',
    flexDirection: 'column',
  },
  etherscan__link: {
    marginTop: 10,
    color: theme.colors.white,
  },
});
