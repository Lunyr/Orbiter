import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Logo } from '../../../components';
import Navigation from '../Navigation';
import styles from './styles';

const Sidebar = ({ classes }) => (
  <div className={classes.container}>
    <header className={classes.header}>
      <Logo hasTitle={true} size={25} />
    </header>
    <Navigation />
  </div>
);

const mapStateToProps = ({ app: { name, version } }) => ({
  name,
  version,
});

export default connect(mapStateToProps)(injectStyles(styles)(Sidebar));
