import React from 'react';
import { default as ReactModal } from 'react-modal';
import injectStyles from 'react-jss';
import cx from 'classnames';
import styles, { modalStyles } from './styles';

// Accessibility entry points for ReactModal
ReactModal.setAppElement('#app');

const Modal = ({
  children,
  classes,
  className,
  contentLabel,
  contentClassName,
  fullSize = false,
  isOpen,
  noPadding,
  onAfterOpen,
  onRequestClose,
}) => (
  <ReactModal
    isOpen={isOpen}
    style={modalStyles({ fullSize }).dialog}
    contentLabel={contentLabel}
    ariaHideApp={false}
    onAfterOpen={onAfterOpen}
    onRequestClose={onRequestClose}
    closeTimeoutMS={300}>
    <div className={cx(classes.container, className)}>
      <div
        className={cx(
          classes.content__container,
          noPadding && classes.noPadding,
          contentClassName
        )}>
        {children}
      </div>
    </div>
  </ReactModal>
);

Modal.defaultProps = {
  contentLabel: 'Modal',
  isOpen: false,
};

export default injectStyles(styles)(Modal);
