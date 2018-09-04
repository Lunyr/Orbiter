export default (theme) => ({
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 10px',
    borderRadius: theme.borderRadius,
  },
  value: {
    fontSize: 10,
    color: 'inherit',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  primary: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
  },
  accent: {
    backgroundColor: theme.colors.accent,
    color: theme.colors.white,
  },
  lightGray: {
    backgroundColor: theme.colors.lightGray,
    color: theme.colors.black,
  },
  gray: {
    backgroundColor: theme.colors.gray,
    color: theme.colors.white,
  },
  green: {
    backgroundColor: theme.colors.green,
    color: theme.colors.white,
  },
  red: {
    backgroundColor: theme.colors.red,
    color: theme.colors.white,
  },
});
