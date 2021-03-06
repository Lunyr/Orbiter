const arrow = (alignedRight) => ({
  '&:before': {
    border: 'inset 6px',
    content: '""',
    display: 'block',
    height: 0,
    width: 0,
    borderColor: 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #fff rgba(0, 0, 0, 0)',
    borderBottomStyle: 'solid',
    position: 'absolute',
    top: -12,
    zIndex: 9,
    ...(alignedRight && { right: 10 }),
    ...(!alignedRight && { left: 10 }),
  },
  '&:after': {
    border: 'inset 7px',
    content: '""',
    display: 'block',
    height: 0,
    width: 0,
    borderColor: 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #fff rgba(0, 0, 0, 0)',
    borderBottomStyle: 'solid',
    position: 'absolute',
    top: -14,
    zIndex: 8,
    ...(alignedRight && { right: 9 }),
    ...(!alignedRight && { left: 9 }),
  },
});

export default (theme) => ({
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  arrowRight: arrow(true),
  arrowLeft: arrow(false),
  button: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 25,
    cursor: 'pointer',
  },
  menu: ({ width, alignedRight }) => ({
    position: 'absolute',
    top: 40,
    zIndex: 10,
    marginTop: 2,
    width,
    maxWidth: 400,
    background: theme.colors.white,
    border: '1px solid',
    borderColor: theme.colors.lightestGray,
    paddingLeft: 0,
    listStyle: 'none',
    boxShadow: theme.boxShadows.large,
    ...(alignedRight && { right: -10 }),
    ...(!alignedRight && { left: 0 }),
  }),
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item__container: {
    '&:hover': {
      backgroundColor: theme.colors.lightestGray,
    },
    '&:active': {
      backgroundColor: theme.colors.lightestGray,
    },
    '&:focus': {
      backgroundColor: theme.colors.lightestGray,
    },
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
});
