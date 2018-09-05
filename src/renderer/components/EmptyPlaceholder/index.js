import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import styles from './styles';

const EmptyPlaceholder = ({ classes }) => (
  <div className={classes.container}>
    <h1 className={classes.title}>
      <FormattedMessage id="empty-placeholder" defaultMessage="No Results Found" />
    </h1>
  </div>
);

export default injectStyles(styles)(EmptyPlaceholder);
