import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';

const ButtonGroup = ({ alignRight, classes, className, children, vertical, gap }) => {
  const childCount = React.Children.count(children) - 1;
  const renderableChildren = Array.isArray(children) ? children.filter(i => i) : [children];
  return (
    <div className={cx(classes.buttonGroup, vertical && classes.vertical__group, className)}>
      {React.Children.map(renderableChildren, (child, index) => (
        <div
          key={index}
          className={cx(classes.buttonGroup__item, index === childCount && classes.noMargin)}
          style={{
            marginRight: gap,
            ...(vertical && {
              marginRight: 0,
              marginBottom: gap,
            }),
          }}>
          {child}
        </div>
      ))}
    </div>
  );
};

const styles = () => ({
  buttonGroup: ({ alignRight, fullWidth }) => ({
    position: 'relative',
    display: 'inline-flex',
    height: 'auto',
    width: fullWidth ? '100%' : 'auto',
    justifyContent: alignRight ? 'flex-end' : 'flex-start',
    alignItems: 'center',
  }),
  vertical__group: {
    flexDirection: 'column',
  },
  buttonGroup__item: {
    height: 'auto',
    width: 'auto',
  },
  noMargin: {
    marginRight: '0 !important',
    marginBottom: '0 !important',
  },
});

ButtonGroup.defaultProps = {
  alignRight: false,
  fullWidth: false,
  gap: 10,
  vertical: false,
};

export default injectStyles(styles)(ButtonGroup);
