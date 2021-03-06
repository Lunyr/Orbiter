export default (theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 0,
    padding: theme.spacing * 2,
    paddingBottom: 0,
    zIndex: 1,
  },
  header__top: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  header__title: {
    ...theme.typography.h1,
    margin: 0,
    fontSize: '1.75rem',
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    padding: theme.spacing * 2,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    padding: theme.spacing,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing * 2,
    boxShadow: theme.boxShadows.small,
  },
  section__title: {
    ...theme.typography.h2,
    margin: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    paddingBottom: 10,
    marginBottom: theme.spacing,
    fontWeight: 500,
  },
  section__content: {
    display: 'flex',
  },
  name: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    height: 25,
    width: 25,
    marginRight: theme.spacing,
  },
  icon: {
    color: theme.colors.gray,
    marginRight: theme.spacing,
  },
});
