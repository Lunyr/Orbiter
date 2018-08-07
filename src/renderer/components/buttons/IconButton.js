import React from 'react';
import injectStyles from 'react-jss';
import Tooltip from 'react-tooltip';
import cx from 'classnames';
import Base from './Base';

const IconButton = ({ id, className, classes, icon, tooltip, ...rest }) => (
  <Base
    id={id}
    className={cx(classes.container, className)}
    type="button"
    {...rest}
    value={
      <React.Fragment>
        <span data-tip data-for={id}>
          {icon}
        </span>
        {tooltip && (
          <Tooltip id={id} place="top" type="dark" effect="float" aria-haspopup="true">
            {tooltip}
          </Tooltip>
        )}
      </React.Fragment>
    }
  />
);

const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    width: 'auto',
    border: 'none',
    minWidth: 'auto',
    paddingLeft: 0,
    paddingRight: 0,
    textTransform: 'none',
    cursor: 'pointer',
    color: theme.colors.gray,
    transition: 'all 0.2s linear',
    '&:hover': {
      color: theme.colors.black,
    },
  },
});

export default injectStyles(styles)(IconButton);
