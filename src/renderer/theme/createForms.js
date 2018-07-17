// Accepts `Color` instances not strings
export default (params) => {
  const { borderRadius, colors, fontSize, fontFamily, spacing } = params;
  const baseFieldStyle = {
    height: 38,
    width: `calc(100% - ${spacing * 2}px)`,
    backgroundColor: colors.white.hsl().string(),
    border: '1px solid',
    borderColor: colors.lightGray.hsl().string(),
    paddingLeft: spacing,
    paddingRight: spacing,
    outline: 'none',
    fontSize,
    borderRadius,
    boxShadow: '0 0 4px 0 #D5D5D5',
    transition: 'box-shadow 0.15s linear',
    fontFamily,
    '&:hover': {
      boxShadow: `0 0 4px 0 ${colors.primary.hsl().string()}`,
    },
    '&:active': {
      boxShadow: `0 0 4px 0 ${colors.primary.hsl().string()}`,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.primary.hsl().string()}`,
    },
  };
  return {
    form: {
      display: 'block',
      height: 'auto',
      width: 'auto',
    },
    fieldset: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      border: 'none',
      width: '100%',
      height: 'auto',
      padding: 0,
      margin: 0,
    },
    group: {
      height: 'auto',
      width: 'auto',
      marginBottom: spacing * 2,
    },
    label: {
      display: 'block',
      marginBottom: 5,
      marginLeft: 3,
      fontFamily,
      fontSize: fontSize * 0.9,
      color: colors.black.hsl().string(),
      width: '100%',
    },
    select: {
      ...baseFieldStyle,
      height: 42,
      width: '100%',
      padding: 0,
    },
    input: baseFieldStyle,
    textarea: {
      ...baseFieldStyle,
      height: 120,
      paddingTop: spacing,
      maxHeight: 300,
    },
    disabled: {
      cursor: 'default',
      opacity: 0.6,
      backgroundColor: colors.lightGray.hsl().string(),
      color: colors.darkGray.hsl().string(),
    },
  };
};
