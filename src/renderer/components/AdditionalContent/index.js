import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import EmptyPlaceholder from '../EmptyPlaceholder';
import AdditionalContentCard from './AdditionalContentCard';
import styles from './styles';

const AdditionalContent = ({ classes, additionalContent = [] }) => {
  return (
    <div className={classes.container}>
      {additionalContent && additionalContent.length > 0 ? (
        <React.Fragment>
          <h1 className={classes.title}>
            <FormattedMessage id="additional-content-title" defaultMessage="Additional Content" />
          </h1>
          {additionalContent.map((content, index) => (
            <div className={classes.card} key={index}>
              <AdditionalContentCard index={index} {...content} />
            </div>
          ))}
        </React.Fragment>
      ) : (
        <EmptyPlaceholder
          title={<FormattedMessage id="empty-placeholder" defaultMessage="No Additional Content" />}
        />
      )}
    </div>
  );
};

export default injectStyles(styles)(AdditionalContent);
