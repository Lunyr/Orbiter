export default (theme) => ({
  blockchain: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    width: 600,
    maxWidth: 850,
  },
  loading__container: {
    display: 'flex',
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  header__icon: {
    color: theme.colors.primary,
    marginRight: theme.spacing,
  },
  refresh: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.colors.primary,
    },
  },
  close: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.colors.error,
    },
  },
  header__title: {
    ...theme.typography.h2,
    fontWeight: 400,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingBottom: theme.spacing,
  },
  // legacy
  gasFeeDisplay: {
    display: 'inline-flex',
  },
  settingUp: {
    fontSize: '1.1em',
    color: '#777777',
    padding: 30,
  },
  gasModal: {
    borderRadius: 4,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    outline: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    marginTop: 0,
    '@media only screen and (max-width: 768px)': {
      width: '100%',
      top: 0,
      left: 0,
      transform: 'none',
      borderRadius: 0,
      overflow: 'auto',
      height: '100%',
      zIndex: 9999,
    },
  },
  errorContainer: {
    marginLeft: theme.spacing * 2,
    marginRight: theme.spacing * 2,
    marginBottom: theme.spacing,
  },
  error: {
    background: '#f5e1de',
    padding: 10,
    'overflow-wrap': 'break-word',
    wordBreak: 'break-all',
    color: '#676870',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  exclamation: {
    color: '#fff',
    background: '#E7665C',
    padding: '5px 15px',
    borderRadius: 4,
    marginRight: 10,
  },
  headerContainer: {
    width: '100%',
    padding: '15px 30px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    '@media only screen and (max-width: 768px)': {
      padding: '20px',
      flexShrink: 0,
    },
  },
  headerIcon: {
    color: '#6589DE',
    marginRight: 5,
  },
  headerText: {
    ...theme.typography.header,
    fontSize: 28,
    marginLeft: 10,
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 30px 15px',
    '@media only screen and (max-width: 768px)': {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'normal',
      padding: '0 20px 20px',
    },
  },
  form__group: {
    display: 'flex',
    flexDirection: 'column',
    '@media only screen and (max-width: 768px)': {
      marginBottom: 20,
    },
  },
  input: theme.forms.input,
  button: theme.buttons.primary,
  description: {
    height: 'auto',
    width: '100%',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    '@media only screen and (max-width: 768px)': {
      display: 'none',
    },
  },
  description__inner: {
    padding: '15px 30px',
    '@media only screen and (max-width: 768px)': {
      padding: '10px',
    },
  },
  description__thankYou: {
    ...theme.typography.body,
    fontSize: 15,
  },
  description__note: {
    ...theme.typography.body,
    fontSize: 13,
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  progressBar: {
    width: '100%',
    overflow: 'hidden',
    padding: '15px 0px',
    paddingBottom: '0px',
  },
  submitInProgress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 20,
  },
  message: {
    fontSize: '1em',
  },
  messageNote: {
    color: '#777777',
  },
  noShow: {
    display: 'none',
  },
  topSpacing: {
    marginTop: 15,
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 30px',
    '@media only screen and (max-width: 768px)': {
      padding: '20px',
    },
  },
  poolInfo: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: '100%',
  },
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },
  circleInfoIcon: {
    color: theme.colors.gray,
    cursor: 'pointer',
    '&:hover': {
      color: theme.colors.darkGray,
    },
  },
  tooltip: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 25,
    width: 25,
    zIndex: 9999,
  },
  title: {
    ...theme.typography.h6,
    marginBottom: 7,
  },
  label: {
    ...theme.typography.h6,
    fontSize: 14,
    marginBottom: 7,
  },
  responsiveLabel: {
    '@media only screen and (max-width: 768px)': {
      fontSize: 14,
    },
  },
  value: {
    ...theme.typography.body,
  },
  success: {
    color: theme.colors.green,
  },
  conversion: {
    paddingLeft: '5px',
  },
  cbnDescription: {
    margin: 0,
    fontSize: '0.9em',
  },
  cbnFail: {
    color: theme.colors.red,
    fontSize: 12,
  },
  cbnFailNotice: {
    ...theme.typography.body,
    fontSize: 13,
    marginBottom: 0,
    color: theme.colors.red,
    opacity: '.8',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 'auto',
    width: '100%',
  },
  footer__inner: {
    width: '100%',
    height: '100%',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer__input: {
    ...theme.forms.input,
    maxWidth: 250,
    marginRight: theme.spacing,
  },
  footer__button: {
    borderRadius: 2,
    height: 42,
  },
  footer__error: {
    display: 'flex',
    flexShrink: 0,
    ...theme.typography.body,
    color: theme.colors.error,
    marginBottom: theme.spacing,
  },
  link: {
    textDecoration: 'none',
    marginTop: theme.spacing,
    marginBottom: theme.spacing,
    color: theme.colors.primary,
  },
});
