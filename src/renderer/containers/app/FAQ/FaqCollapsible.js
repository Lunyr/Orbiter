import React from 'react';
import injectStyles from 'react-jss';
import Collapsible from 'react-collapsible';

const FaqCollapsible = ({ classes, description, title }) => (
  <div className={classes.collapsibleContainer + ' collapsibleWrapper'}>
    <Collapsible trigger={title} transitionTime={100}>
      <div className={classes.description}>{description}</div>
    </Collapsible>
  </div>
);

const styles = (theme) => ({
  collapsibleContainer: {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, .1)',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    paddingTop: '17px',
    paddingLeft: '20px',
    paddingBottom: '20px',
  },
  description: {
    width: '746px',
    opacity: '0.8',
    color: '#63646D',
    fontFamily: 'Roboto',
    fontSize: '14px',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
});

export default injectStyles(styles)(FaqCollapsible);
