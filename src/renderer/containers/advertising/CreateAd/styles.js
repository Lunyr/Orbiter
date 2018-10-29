export default (theme) => ({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    overflow: 'auto',
  },
  header: {
    padding: '25px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myAdsTitle: {
    fontSize: '26px',
    fontWeight: '300',
    color: '#3C394C',
  },
  frequencyAndSlot: {
    display: 'flex',
    width: '50%',
    flexDirection: 'column',
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    overflow: 'auto',
    width: '100%',
  },
  upper: {
    display: 'inline-flex',
    borderBottom: '1px solid #eee',
    paddingTop: '20px',
    margin: 0,
    padding: 0,
    width: '100%',
  },
  lower: {
    background: theme.colors.white,
    margin: 0,
    width: '100%',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    marginTop: theme.spacing,
    marginBottom: theme.spacing * 2,
  },
  help: {
    ...theme.typography.h2,
    padding: theme.spacing * 2,
    fontSize: '1.1rem',
  },
});
