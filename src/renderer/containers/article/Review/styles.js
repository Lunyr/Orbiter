export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: theme.colors.white,
    height: 'auto',
    width: '100%',
    overflow: 'auto',
  },
  article: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  header: {
    width: '100%',
    height: 'auto',
    maxHeight: 'calc((100vw) / 3)',
    flexShrink: 0,
    overflow: 'hidden',
  },
  reviewLabel: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    boxShadow: theme.boxShadows.large,
  },
  reviewLabel__value: {
    fontSize: '0.9rem',
    fontWeight: 400,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
  },
  editor: {
    marginTop: theme.spacing,
    marginBottom: theme.spacing,
  },
  aside: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'column',
    width: '25%',
    maxWidth: 250,
    height: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  title__container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
    marginTop: theme.spacing,
    marginBottom: theme.spacing,
  },
  title: {
    ...theme.typography.h1,
    wordBreak: 'break-word',
    fontSize: '2.5rem',
    fontWeight: 400,
    marginRight: theme.spacing,
    marginBottom: 0,
    marginTop: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing,
    minHeight: 60,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  },
  langAdded: {
    backgroundColor: '#d7e9be',
  },
  langChanged: {
    backgroundColor: '#f2c3bc',
  },
  langChange: {
    padding: 5,
    alignSelf: 'flex-start',
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
