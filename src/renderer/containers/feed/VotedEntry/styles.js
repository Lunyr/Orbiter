export default (theme) => ({
  voted: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  link: {
    textDecoration: 'none',
    cursor: 'pointer',
  },
  title: {
    fontWeight: 500,
    textDecoration: 'none',
    color: 'rgba(53, 64, 82, 0.8)',
    marginBottom: 2,
  },
  card: {
    padding: theme.spacing,
    backgroundColor: theme.colors.white,
    height: 90,
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: theme.spacing * 1.5,
    borderRadius: theme.borderRadius,
    wordWrap: 'break-word',
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    transition: 'transform 0.2s',
    '&:hover': {
      boxShadow: '0px 0px 25px #cfcfd1',
      transform: 'scale(1.05)',
    },
  },
  coalesce__container: {
    marginBottom: theme.spacing * 1.5,
  },
  coalescedCard: {
    position: 'relative',
    marginBottom: 0,
    borderRadius: 0,
    '&:hover': {
      borderRadius: theme.borderRadius,
    },
  },
  coalescedCard__spacer: {
    borderRadius: 0,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0px 0px 25px #cfcfd1',
      borderRadius: theme.borderRadius,
      zIndex: 100,
    },
  },
  coalescedCard__topBorderRadius: {
    borderTopLeftRadius: theme.borderRadius,
    borderTopRightRadius: theme.borderRadius,
  },
  coalescedCard__bottomBorderRadius: {
    borderBottomLeftRadius: theme.borderRadius,
    borderBottomRightRadius: theme.borderRadius,
  },
  headerTitle: {
    marginLeft: 5,
  },
});
