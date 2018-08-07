import theme from '../../theme';

export const modalStyles = ({ fullSize }) => ({
  dialog: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1001,
    },
    content: fullSize
      ? {
          position: 'absolute',
          height: '100%',
          width: '100%',
          background: 'transparent',
          top: 0,
          left: 0,
          padding: 0,
          margin: 0,
        }
      : {
          position: 'absolute',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#FFFFFF',
          boxShadow: theme.boxShadows.medium,
          borderRadius: theme.borderRadius,
          padding: 0,
          border: 'none',
        },
  },
});

export default (theme) => ({
  container: ({ fullSize, width }) => ({
    width: fullSize ? '100%' : width,
    ...(fullSize && {
      height: '100%',
    }),
  }),
  content__container: {
    padding: 0,
    height: '100%',
    width: '100%',
  },
  noPadding: {
    padding: '0 !important',
  },
});
