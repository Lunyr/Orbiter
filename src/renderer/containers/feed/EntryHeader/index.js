import React from 'react';
import injectStyles from 'react-jss';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import { Avatar, Label } from '../../../components/';
import { timeAgoDisplay } from '../../../../shared/utils';
import styles from './styles';

class EntryHeader extends React.Component {
  pushState = (e, url) => {
    e.stopPropagation();
    this.props.history.replace(url);
  };

  render() {
    const { actionText, address, classes, labelValue, labelType, size, updatedAt } = this.props;
    return (
      <React.Fragment>
        <h2 className={cx(classes.entryHeader__username)}>
          <Avatar seed={address} size={size} />
        </h2>
        <div className={classes.entryHeader}>
          <h3 className={classes.entryHeader__title}>
            <div style={{ wordBreak: 'break-word' }}>
              <span className={classes.entryHeader__username}>
                <strong>{address}</strong>
              </span>
              {actionText}
            </div>
          </h3>
          <div className={classes.entryHeader__meta}>
            <span className={classes.meta__updatedAt}>{timeAgoDisplay(updatedAt)}</span>
            <Label type={labelType} value={labelValue} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

EntryHeader.defaultProps = {
  labelType: 'primary',
  size: 50,
};

EntryHeader.propTypes = {
  actionText: PropTypes.any.isRequired,
  labelValue: PropTypes.any.isRequired,
  updatedAt: PropTypes.string,
  address: PropTypes.string.isRequired,
  labelType: PropTypes.string,
  size: PropTypes.number,
};

export default withRouter(injectStyles(styles)(EntryHeader));
