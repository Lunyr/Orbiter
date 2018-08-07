export default theme => ({
  container: ({ height, minHeight, maxWidth, minWidth, width, styleOverrides }) => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: minWidth || width,
    maxWidth: maxWidth || width,
    minHeight,
    backgroundColor: theme.colors.white,
    ...styleOverrides,
    borderRadius: theme.borderRadius,
    flexGrow: 1,
  }),
  boxShadow: {
    boxShadow: theme.boxShadows.small,
  },
  header: ({ extraPadding }) => ({
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    height: 50,
    ...theme.typography.h6,
    paddingLeft: extraPadding ? theme.spacing * 2 : theme.spacing,
    paddingRight: extraPadding ? theme.spacing * 2 : theme.spacing,
    fontWeight: 600,
  }),
  content: ({ extraPadding, noPadding }) => ({
    display: 'flex',
    flexGrow: 1,
    padding: noPadding ? 0 : theme.spacing,
    paddingLeft: noPadding ? 0 : extraPadding ? theme.spacing * 2 : theme.spacing,
    paddingRight: noPadding ? 0 : extraPadding ? theme.spacing * 2 : theme.spacing,
  }),
});
