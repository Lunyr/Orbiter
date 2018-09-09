import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import styles from './styles';

const EmptyPlaceholder = ({ classes, children }) => (
  <div className={classes.container}>
    <h1 className={classes.title}>
      <FormattedMessage id="empty-placeholder" defaultMessage="No Results Found" />
    </h1>
    {children}
  </div>
);

export default injectStyles(styles)(EmptyPlaceholder);
