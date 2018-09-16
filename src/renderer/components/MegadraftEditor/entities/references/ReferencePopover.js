/***
 * Reference popover component for the content inside popover
 * @craiglu
 */
/*
import React, { Component } from 'react';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import moment from 'moment';

// Components
import ReferenceFormatter from '../../references/ReferenceFormatter';

export default class ReferenceComponent extends Component {
  render() {
    const { reference } = this.props;
    const updated = reference.creation_date !== reference.updated_date;
    const creationDate = moment(reference.creation_date).format('MMM Do YYYY');
    const updatedDate = moment(reference.updated_date).format('MMM Do YYYY');
    return (
      <div className={css(styles.referenceContainer)}>
        <ReferenceFormatter reference={reference} />
        <div className={css(styles.addedBy)}>
          {updated
            ? `Edited by ${reference.author} on ${updatedDate}`
            : `Created by ${reference.author} on ${creationDate}`}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  referenceContainer: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: '300',
    boxShadow: '0 3px 10px 0 rgba(0,0,0,0.3)',
    border: '1px solid rgba(0,0,0,0.1)',
    textAlign: 'left',
    zIndex: '2',
    padding: '10px',
    position: 'relative',
    background: '#F2F2F2',
    color: '#77787A',
  },
  addedBy: {
    marginTop: '15px',
    textAlign: 'right',
    fontFamily: 'Roboto',
    fontSize: '12px',
  },
});
*/
