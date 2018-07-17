export default (theme) => ({
  container: {
    display: 'inline-flex',
    height: '100%',
    width: '100%',
  },
  columnOne: ({ sidebarWidth: width }) => ({
    display: 'flex',
    width,
    height: '100%',
    flexShrink: 0,
  }),
  columnTwo: ({ sidebarWidth: width }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${width}px)`,
    height: '100%',
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  }),
});
