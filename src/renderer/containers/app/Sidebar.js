import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { Link } from 'react-router-dom';

const Sidebar = ({ classes, name, version }) => (
  <div className={classes.container}>
    <header className={classes.header}>
      <h1 className={classes.name}>{name}</h1>
    </header>
    <nav className={classes.nav}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/another-page">Page 1</Link>
        </li>
      </ul>
    </nav>
    <footer className={classes.footer}>
      <p className={classes.version}>Orbiter {version}</p>
    </footer>
  </div>
);

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.darkerGray,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 70,
    backgroundColor: theme.colors.darkestGray,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
  },
  name: {
    ...theme.typography.h1,
    color: theme.colors.white,
    fontWeight: 300,
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  version: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: 300,
  },
});

const mapStateToProps = ({ app: { name, version } }) => ({
  name,
  version,
});

export default connect(mapStateToProps)(injectStyles(styles)(Sidebar));
