import React from 'react';
import injectStyles from 'react-jss';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Avatar, Label } from '../../../components/';
import { timeAgoDisplay } from '../../../../shared/utils';

class EntryHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileHovered: false,
    };
  }

  /***
   * Push user to certain URL
   * @params e -- react onClick event
   * @params string url -- url to push to
   */
  pushState = (e, url) => {
    e.stopPropagation();
    this.props.history.push(url);
  };

  onUserProfileClick = event => {
    event.preventDefault();
    event.stopPropagation();

    return (
      this.props.onUserProfileClick && this.props.onUserProfileClick({ user: this.props.user })
    );
  };

  render() {
    let { actionText, labelValue, labelType, size, updatedAt, user } = this.props;
    return (
      <React.Fragment>
        <h2
          className={css(
            styles.entryHeader__username,
            this.state.profileHovered && styles.profileHovered
          )}
          onMouseOver={() => this.setState({ profileHovered: true })}
          onMouseLeave={() => this.setState({ profileHovered: false })}
          onClick={this.onUserProfileClick}
        >
          <Avatar account={user} size={size} />
        </h2>
        <div className={css(styles.entryHeader)}>
          <h3 className={css(styles.entryHeader__title)}>
            <div style={{ wordBreak: 'break-word' }}>
              <span
                onClick={this.onUserProfileClick}
                className={css(styles.entryHeader__username)}
                onMouseOver={() => this.setState({ profileHovered: true })}
                onMouseLeave={() => this.setState({ profileHovered: false })}
              >
                <strong className={css(this.state.profileHovered && styles.profileHovered)}>
                  {user.username}
                </strong>
              </span>
              {actionText}
            </div>
          </h3>
          <div className={css(styles.entryHeader__meta)}>
            <span className={css(styles.meta__updatedAt)}>{timeAgoDisplay(updatedAt)}</span>
            <Label type={labelType} value={labelValue} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

EntryHeader.defaultProps = {
  labelType: 'blue',
  size: 50,
};

EntryHeader.propTypes = {
  actionText: PropTypes.any.isRequired,
  labelValue: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  labelType: PropTypes.string,
  size: PropTypes.number,
};

const styles = StyleSheet.create({
  entryHeader: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing,
    '@media only screen and (max-width: 768px)': {
      marginLeft: 5,
    },
  },
  profileHovered: {
    transform: 'scale(1.08)',
    fontSize: '22px',
  },
  title: {
    ...theme.typography.header,
    fontWeight: 400,
    fontSize: 22,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    textDecoration: 'none',
  },
  entryHeader__username: {
    fontWeight: 600,
    color: 'rgba(53, 64, 82, 0.8)',
    marginRight: 6,
    textDecoration: 'none',
  },
  entryHeader__title: {
    ...theme.typography.header,
    fontSize: 18,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(53, 64, 82, 0.8)',
    margin: '0 0 5px 0',
    '@media only screen and (max-width: 768px)': {
      fontSize: 15,
    },
  },
  entryHeader__meta: {
    ...theme.typography.help,
    display: 'inline-flex',
    color: 'rgba(53, 64, 82, 0.8)',
  },
  meta__updatedAt: {
    marginRight: theme.spacing,
    color: 'rgba(53, 64, 82, 0.6)',
    marginTop: 3,
    fontSize: 12,
  },
});

export default withRouter(EntryHeader);
