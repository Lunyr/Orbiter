import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { Logo } from '../../components';

class ConnectingSplash extends React.Component {
  state = {
    error: null,
    isShowing: true,
    timer: new Date().getTime(),
    retries: 30,
  };

  minimumViewTimeMs = 2000;

  showChildren = () => {
    this.setState(({ retries, timer }) => {
      if (this.props.connecting && retries !== 0) {
        setTimeout(this.showChildren, this.minimumViewTimeMs);
        return { isShowing: true, retries: retries - 1 };
      } else if (retries === 0) {
        return {
          isShowing: true,
          error:
            'Uh oh! There was an error while connecting to the network. Please try again later.',
        };
      } else {
        const currentTime = new Date().getTime();
        const timeLeft = timer + this.minimumViewTimeMs - currentTime;
        if (timeLeft > 0) {
          return { isShowing: true };
        }
        return { isShowing: false };
      }
    });
  };

  componentDidUpdate({ connecting }) {
    if (connecting && !this.props.connecting) {
      this.showChildren();
    }
  }

  componentDidMount() {
    setTimeout(this.showChildren, this.minimumViewTimeMs);
  }

  render() {
    const { classes, children } = this.props;
    const { error, isShowing } = this.state;
    return isShowing ? (
      <div className={classes.container}>
        {error ? (
          <div className={cx(classes.inner, 'bounce-in-fwd')}>
            <img src={require('../../assets/images/spaceship.png')} />
            <h1 className={classes.title}>{error}</h1>
          </div>
        ) : (
          <div className={cx(classes.inner, 'bounce-in-fwd')}>
            <Logo hasTitle={false} size={100} />
            <h1 className={classes.title}>Connecting to blockchain...</h1>
          </div>
        )}
      </div>
    ) : (
      children
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.black,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    ...theme.typography.h5,
    color: theme.colors.white,
    fontWeight: 300,
    marginTop: theme.spacing * 2,
  },
  image: {
    width: 328,
    height: 381,
  },
});

export default injectStyles(styles)(ConnectingSplash);
