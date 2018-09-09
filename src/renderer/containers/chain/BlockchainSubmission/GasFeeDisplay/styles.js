export default (theme) => ({
  gasFee: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },
  gasFeeDisplay: {
    display: 'flex',
    alignItems: 'center',
    height: 36,
    '@media only screen and (max-width: 768px)': {
      width: '100%',
    },
  },
  ethEstimation: {
    width: 200,
  },
  gasChoice: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    '@media only screen and (max-width: 768px)': {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'normal',
    },
  },
  gasValue: {
    ...theme.typography.label,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: theme.forms.input,
  disabled: {
    cursor: 'not-allowed',
  },
  balanceGroup: {
    '@media only screen and (max-width: 768px)': {
      marginTop: 20,
    },
  },
  balance: {
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversion: {
    paddingLeft: '5px',
  },
  error: {
    color: theme.colors.red,
  },
  label: {
    ...theme.typography.label,
    display: 'flex',
    marginBottom: 10,
  },
  help: {
    position: 'relative',
    ...theme.typography.help,
    fontSize: 13,
    top: 8,
    left: 3,
  },
  view__address: {
    display: 'block',
    ...theme.typography.help,
    color: theme.colors.blue,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 10,
    cursor: 'pointer',
  },
});
