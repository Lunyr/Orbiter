import React from 'react';
import { FormattedMessage } from 'react-intl';
import injectStyles from 'react-jss';
import Tooltip from 'react-tooltip';
import Avatar from '../Avatar';
import styles from './styles';

const ContributorAvatar = ({ classes, contributor }) => {
  return (
    <div className={classes.contributor} data-tip data-for={contributor}>
      <Avatar seed={contributor} size={40} />
      <Tooltip id={contributor} place="top" type="dark" effect="float" aria-haspopup="true">
        {contributor}
      </Tooltip>
    </div>
  );
};

const Contributors = ({ classes, contributors }) => (
  <div className={classes.contributors}>
    <h3 className={classes.tagLine}>
      <FormattedMessage
        id="contributors_title"
        defaultMessage="Contributors ({count})"
        values={{
          count: contributors.length,
        }}
      />
    </h3>
    <div className={classes.avatars}>
      {contributors &&
        contributors.length > 0 &&
        contributors.map((contributorAddress, index) => (
          <ContributorAvatar key={index} classes={classes} contributor={contributorAddress} />
        ))}
    </div>
  </div>
);

export default injectStyles(styles)(Contributors);
