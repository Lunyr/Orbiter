export default (theme) => ({
  reviewSequenceContainer: theme.positions.center,
  reviewSequence: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    width: '100%',
    height: '100%',
    boxShadow: theme.boxShadows.medium,
    padding: theme.spacing,
  },
  centered: {
    justifyContent: 'center',
  },
  reviewIcon: {
    '@media only screen and (max-width: 1024px)': {
      display: 'none',
    },
  },
  reviewSequence__title: {
    ...theme.typography.h2,
    marginTop: '10px',
  },
  reviewSequence__help: {
    ...theme.typography.body,
    margin: 0,
    lineHeight: '24px',
    whiteSpace: 'pre-wrap',
  },
  reviewSequence__form: {
    margin: '20px 0 30px 0',
  },
  form__error: {
    color: theme.colors.red,
    margin: '0 0 10px 0',
  },
  form__group: {
    ...theme.positions.inlineCenter,
    height: 40,
    width: '100%',
  },
  form__label: {
    ...theme.typography.body,
    userSelect: 'none',
  },
  checked: {
    color: theme.colors.black,
    '::after': {
      top: 9,
    },
  },
  form__actions: {
    ...theme.positions.center,
    marginTop: theme.spacing,
    flexDirection: 'row',
  },
  action__accept: {
    ...theme.buttons.success,
    marginRight: theme.spacing,
    '@media only screen and (min-width: 1440px)': {
      minWidth: '150px',
    },
  },
  feedback: {
    height: '200px',
    width: '100%',
    borderRadius: '4px',
    background: '#F0F0F3',
    margin: '20px 0px',
    border: 'none',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
    padding: '20px',
  },
  action__back: {
    ...theme.buttons.base,
    marginBottom: '15px',
    '@media only screen and (min-width: 1024px)': {
      marginRight: theme.spacing,
      marginBottom: '0px',
      minWidth: '120px',
    },
    '@media only screen and (min-width: 1440px)': {
      minWidth: '150px',
    },
  },
  action__no: {
    ...theme.buttons.base,
  },
  action__reject: {
    ...theme.buttons.cancel,
    '@media only screen and (min-width: 1024px)': {
      minWidth: '120px',
    },
    '@media only screen and (min-width: 1440px)': {
      minWidth: '150px',
    },
  },
  action__disabled: {
    ...theme.buttons.disabled,
    opacity: '0.4',
    filter: 'grayscale(1)',
  },
  prominent: {
    boxShadow: theme.boxShadows.large,
  },
  criteriaContainer: {
    marginTop: '10px',
  },
  criteriaSet: {
    marginTop: '25px',
    marginBottom: '25px',
  },
  rejectOptions: {
    maxHeight: '80vh',
  },
  bulletPoint: {
    marginRight: '15px',
    color: '#E5C100',
  },
  voteStatus: {
    textAlign: 'center',
    paddingTop: theme.spacing,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
  },
  voteStatus__header: {
    ...theme.typography.h2,
    fontSize: 20,
    fontWeight: 500,
    marginTop: theme.spacing,
  },
  voteStatus__help: {
    ...theme.typography.body,
    lineHeight: '24px',
  },
  errorMark: {
    color: theme.colors.red,
  },
  checkMark: {
    color: theme.colors.blue,
  },
  reviewStatus: {
    color: theme.colors.green,
    marginLeft: 7,
    fontWeight: 600,
  },
  rejected: {
    color: theme.colors.red,
  },
  warningMark: {
    color: theme.colors.yellow,
  },
  link: {
    ...theme.typography.body,
    textDecoration: 'none',
    texTransform: 'uppercase',
    color: theme.colors.black,
    ':hover': {
      color: theme.colors.blue,
    },
  },
});
