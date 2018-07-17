export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  header__container: ({ noHeaderMargins, noMargins }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    paddingLeft: noHeaderMargins || noMargins ? 0 : theme.spacing * 4,
    paddingRight: noHeaderMargins || noMargins ? 0 : theme.spacing * 4,
  }),
  content__container: ({ contentBottomMargin, contentTopMargin, noMargins }) => ({
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: noMargins ? 0 : theme.spacing * 4,
    paddingRight: noMargins ? 0 : theme.spacing * 4,
    paddingBottom: noMargins ? 0 : theme.spacing * 4,
    overflow: 'auto',
    ...(contentBottomMargin && {
      marginBottom: theme.spacing * 4,
    }),
    ...(contentTopMargin && {
      marginTop: theme.spacing * 4,
    }),
  }),
  footer__container: ({ noMargins }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    paddingLeft: noMargins ? 0 : theme.spacing * 4,
    paddingRight: noMargins ? 0 : theme.spacing * 4,
  }),
  centered: {
    justifyContent: 'center',
  },
  noMargins: {
    padding: 0,
    margin: 0,
  },
});
