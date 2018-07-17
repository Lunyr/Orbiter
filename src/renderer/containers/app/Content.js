import React from 'react';
import injectStyles from 'react-jss';
import { Switch, Route } from 'react-router-dom';
import Test from '../test';

const Content = ({ classes }) => (
  <div className={classes.container}>
    <Switch>
      <Route exact path="/another-page" component={() => <div>Another Page</div>} />
      <Route component={Test} />
    </Switch>
  </div>
);

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing,
  },
});

export default injectStyles(styles)(Content);
