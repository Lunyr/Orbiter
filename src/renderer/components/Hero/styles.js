export default (theme) => ({
  hero: {
    width: '100%',
    height: 'auto',
    position: 'relative',
    overflow: 'hidden',
  },
  cropping: {},
  hero__image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    maxHeight: 'inherit',
  },
  hero__actions: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  crop__button: {
    opacity: 0.6,
    '&:hover': {
      opacity: 1,
    },
  },
  disabled: {
  
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    maxHeight: 'inherit',
    overflow: 'hidden',
  },
  cropper__wrapper: {
    height: '100%',
  },
  cropper: {
    height: '100%',
  },
  dropzone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    background: theme.colors.gray,
    maxHeight: 'inherit',
    opacity: 0.95,
    '&:hover': {
      opactiy: 1,
    },
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.5)',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    color: theme.colors.white,
  },
});
