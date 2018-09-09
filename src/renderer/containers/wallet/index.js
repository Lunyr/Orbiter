import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import styles from './styles';

class Wallet extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return <div className={classes.container}>{JSON.stringify(this.props.wallet, null, 4)}</div>;
  }
}

const mapStateToProps = ({ wallet }) => ({ wallet });

export default connect(mapStateToProps)(injectStyles(styles)(Wallet));
