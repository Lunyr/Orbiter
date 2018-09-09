export default (theme) => ({
  container: {
    display: 'inline-flex',
    height: '100%',
    width: '100%',
  },
  columnOne: ({ sidebarWidth: width }) => ({
    position: 'relative',
    display: 'flex',
    width,
    height: '100%',
    flexShrink: 0,
    zIndex: 1,
  }),
  columnTwo: ({ sidebarWidth: width }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${width}px)`,
    height: '100%',
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    zIndex: 2,
  }),
  closed: {
    display: 'none !important',
  },
  toggler: {
    position: 'absolute',
    top: 17,
    right: theme.spacing,
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    zIndex: 20,
    '&:hover': {
      color: theme.colors.white,
    },
  },
});
