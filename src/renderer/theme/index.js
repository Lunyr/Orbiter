import Color from 'color';
import createButtons from './createButtons';
import createForms from './createForms';
import createTypography from './createTypography';

const borderRadius = 4;

const boxShadows = {
  large: '0 22px 60px 0 rgba(38,39,82,0.15)',
  medium: '0 11px 30px 0 rgba(38,39,82,0.15)',
  small: '0 6px 15px 0 rgba(38,39,82,0.15)',
};

const colorMapping = {
  primary: Color('#f14e10'),
  primaryLight: Color('#b6d5de'),
  primaryDark: Color('#03566d'),
  accent: Color('#ff845e'),
  black: Color('#3c394c'),
  darkestGray: Color('#242C2F'),
  darkerGray: Color('#3A3F45'),
  darkGray: Color('#777777'),
  gray: Color('#4c4c4c'),
  lightGray: Color('#f2f2f2'),
  lightestGray: Color('#f8f8f8'),
  white: Color('#ffffff'),
  info: Color('#6589DE'),
  success: Color('#6EB727'),
  warning: Color('#FFFF99'),
  error: Color('#F14E10'),
};

const gradients = {
  primary: {
    backgroundImage: 'radial-gradient(50% 140%, #1b8cb0 0%, rgba(28,108,137,1) 100%)',
  },
};

const fontSize = 14;

const fontFamily = 'Roboto, sans-serif';

const srOnly = {
  position: 'absolute',
  left: -10000,
  top: 'auto',
  width: 1,
  height: 1,
  overflow: 'hidden',
};

const spacing = 15;

const overflow = {
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflowX: 'hidden',
};

const positions = {
  centerText: {
    textAlign: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineCenter: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  verticalCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  horizontalCenter: {
    margin: '0 auto',
  },
};

// Transforms `Color` objects into actual hex values to use
const colorsMapStrings = (colorMap) => {
  return Object.keys(colorMap).reduce((acc, colorKey) => {
    acc[colorKey] = colorMap[colorKey].string();
    return acc;
  }, {});
};

/*
* Returns a configured theme object. This can be used directly or
* re-compiled into a css library of choice
*/
export default {
  boxShadows,
  buttons: createButtons({
    boxShadows,
    borderRadius,
    fontFamily,
    fontSize,
    spacing,
    config: {
      base: {
        background: colorMapping.lightGrey,
        color: colorMapping.darkGrey,
      },
      primary: {
        background: colorMapping.primary,
        color: colorMapping.white,
      },
      secondary: undefined,
      error: {
        background: colorMapping.error,
        color: colorMapping.white,
      },
      success: {
        background: colorMapping.success,
        color: colorMapping.white,
      },
      warning: undefined,
      info: undefined,
      inverse: undefined,
      text: {
        background: Color('transparent'),
        color: colorMapping.primary,
      },
    },
  }),
  colors: colorsMapStrings(colorMapping),
  forms: createForms({
    borderRadius,
    colors: colorMapping,
    fontFamily,
    fontSize,
    spacing,
  }),
  gradients,
  overflow,
  positions,
  spacing,
  srOnly,
  typography: createTypography({
    baseFontColor: colorMapping.black.toString(),
    baseFontSize: fontSize,
    fontFamily,
  }),
};
