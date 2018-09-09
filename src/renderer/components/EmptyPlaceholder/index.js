import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import styles from './styles';

const EmptyPlaceholder = ({ classes, children, title }) => (
  <div className={classes.container}>
    <h1 className={classes.title}>
      {!title ? (
        <FormattedMessage id="empty-placeholder" defaultMessage="No Results Found" />
      ) : (
        title
      )}
    </h1>
    {children}
  </div>
);

export default injectStyles(styles)(EmptyPlaceholder);
