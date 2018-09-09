const baseButton = {
  height: 34,
  color: '#ffffff',
  background: '#eeeeee',
  border: '1px solid #cccccc',
  cursor: 'pointer',
  outline: 'none',
  borderRadius: 2,
  transition: 'background-color 0.25s linear',
};

// Returns a button style map
const createButton = ({ boxShadows, borderRadius, fontFamily, fontSize, spacing }) => (params) => {
  if (!params || !params.background || !params.color) {
    return {};
  }
  const { background, color } = params;
  return Object.assign({}, baseButton, {
    borderRadius,
    fontFamily,
    fontSize,
    backgroundColor: background.string(),
    color: color.string(),
    borderColor: background.darken(0.05).string(),
    paddingLeft: spacing,
    paddingRight: spacing,
    boxShadow: boxShadows.medium,
    fontWeight: 300,
    '&:hover': {
      backgroundColor: background.lighten(0.1).string(),
    },
    '&:active': {
      backgroundColor: background.lighten(0.2).string(),
    },
    '&:focus': {
      backgroundColor: background.lighten(0.2).string(),
    },
  });
};

// Accepts `Color` instances not strings
export default (params) => {
  const {
    base,
    primary,
    secondary,
    error,
    success,
    warning,
    info,
    inverse,
    text,
    cancel,
  } = params.config;
  const creator = createButton(params);
  return {
    base: creator(base),
    primary: creator(primary),
    secondary: creator(secondary),
    error: creator(error),
    success: creator(success),
    warning: creator(warning),
    info: creator(info),
    inverse: creator(inverse),
    text: Object.assign({}, creator(text), {
      boxShadow: 'none',
      '&:hover': {
        color: text.color.darken(0.2).string(),
      },
      '&:active': {
        color: text.color.darken(0.3).string(),
      },
      '&:focus': {
        color: text.color.darken(0.3).string(),
      },
    }),
    cancel: creator(cancel),
    disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  };
};
