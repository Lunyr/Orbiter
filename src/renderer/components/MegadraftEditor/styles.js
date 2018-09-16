export const customStyleMap = {
  TITLE: {
    fontWeight: 400,
    borderBottom: '1px solid rgba(0, 0, 0, .1)',
    paddingBottom: 30,
    fontSize: 24,
    width: '100%',
  },
  NEWTEXT: {
    background: '#d7e9be',
    padding: '0px 2px',
  },
  STRIKETHROUGH: {
    textDecoration: 'line-through',
    background: '#f2c3bc',
    padding: '0px 2px',
  },
};

export default (theme) => ({
  editor: {
    position: 'relative',
  },
  editor__details: {
    display: 'flex',
    right: theme.spacing,
    position: 'sticky',
    top: 2,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 35,
    paddingRight: theme.spacing,
    backgroundColor: theme.colors.white,
  },
  details__text: {
    display: 'flex',
    ...theme.typography.small,
    margin: 0,
    marginLeft: theme.spacing,
    color: theme.colors.black,
    textTransform: 'uppercase',
    transition: 'opacity 0.3s ease-out',
  },
  saver: {
    opacity: 1,
  },
  invisible: {
    opacity: 0,
  },
  hidden: {
    display: 'none',
  },
});
