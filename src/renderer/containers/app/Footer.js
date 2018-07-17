import React from 'react';
import injectStyles from 'react-jss';

const Footer = ({ classes }) => <footer className={classes.container}>Footer Here</footer>;

const styles = (theme) => ({
  container: ({ height }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height,
    backgroundColor: theme.colors.lightGray,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  }),
});

export default injectStyles(styles)(Footer);
