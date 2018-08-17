const createBaseTypography = ({ baseFontSize, fontFamily }) => ({
  h1: {
    fontFamily,
    fontSize: baseFontSize * 2.5,
    fontWeight: 400,
    letterSpacing: 0.825,
  },
  h2: {
    fontFamily,
    fontSize: baseFontSize * 2.25,
    fontWeight: 400,
    letterSpacing: 0.825,
  },
  h3: {
    fontFamily,
    fontSize: baseFontSize * 2,
    fontWeight: 400,
    letterSpacing: 0.825,
  },
  h4: {
    fontFamily,
    fontSize: baseFontSize * 1.75,
    fontWeight: 400,
    letterSpacing: 0.825,
  },
  h5: {
    fontFamily,
    fontSize: baseFontSize * 1.5,
    fontWeight: 400,
    letterSpacing: 0.825,
  },
  h6: {
    fontFamily,
    fontSize: baseFontSize * 1.25,
    fontWeight: 400,
    letterSpacing: 0.825,
  },
  body: {
    fontFamily,
    fontSize: baseFontSize,
    fontWeight: 300,
  },
  small: {
    fontFamily,
    fontSize: baseFontSize * 0.85,
    fontWeight: 400,
  },
});

const createTypography = ({ h1, h2, h3, h4, h5, h6, body, small }, color) => ({
  h1: { ...h1, color },
  h2: { ...h2, color },
  h3: { ...h3, color },
  h4: { ...h4, color },
  h5: { ...h5, color },
  h6: { ...h6, color },
  body: { ...body, color },
  small: { ...small, color },
});

// Accepts `Color` instances not strings
export default ({ baseFontColor, baseFontSize, fontFamily }) => {
  const baseTypoDefinition = createBaseTypography({ baseFontSize, fontFamily });
  return {
    baseFontSize,
    fontFamily,
    ...createTypography(baseTypoDefinition, baseFontColor),
  };
};
