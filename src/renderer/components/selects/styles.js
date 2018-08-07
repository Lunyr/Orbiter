import theme from '../../theme/index';

export default ({ height, multi }) => ({
  control: (base, { isDisabled }) => ({
    ...base,
    ...theme.forms.select,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    color: isDisabled ? theme.colors.black : theme.colors.darkGray,
    background: isDisabled ? theme.colors.lightestGray : 'inherit',
    height,
    minHeight: 32,
    ...(multi && {
      height: 'auto',
    }),
  }),
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 10000,
  }),
  option: (base, { isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? theme.colors.primary : base.backgroundColor,
    '&:active': {
      backgroundColor: theme.colors.primary,
    },
  }),
});
