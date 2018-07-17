import React from 'react';
import injectStyles from 'react-jss';

const Header = ({ classes }) => <header className={classes.container}>Header Here</header>;

const styles = (theme) => ({
  container: ({ height }) => ({
    display: 'flex',
    alignItems: 'center',
    height,
    backgroundColor: theme.colors.white,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
  }),
});
export default injectStyles(styles)(Header);
