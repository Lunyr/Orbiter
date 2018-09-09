/***
 * already added references displayed when adding a new reference to the same spot
 * @craiglu
 */

import React from 'react';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';

// Components
import ReferenceFormatter from '../../references/ReferenceFormatter';

export default class ExistingReferences extends React.Component {
  render() {
    return (
      <div className={css(styles.existingReferencesContainer)}>
        {this.props.referenceArray
          ? this.props.referenceArray.map((reference, index) => {
              return (
                <div
                  key={`existing_reference_${reference.block_key}_${reference.endOffset}_${
                    reference.creation_date
                  }_${reference.update_date}`}
                  className={css(styles.referenceContainer)}
                >
                  <div className={css(styles.reference)}>
                    <span className={css(styles.referenceNumber)}>{reference.refNum}</span>
                    <div className={css(styles.referenceInfoContainer)}>
                      <span className={css(styles.referenceInfo)}>
                        <ReferenceFormatter reference={reference} />
                      </span>
                    </div>
                  </div>
                  <div className={css(styles.iconsContainer)}>
                    <i
                      onClick={() => this.props.editButton(index)}
                      className={css(styles.icon) + ' fa fa-pencil-square-o'}
                      aria-hidden="true"
                    />
                    <i
                      onClick={() => this.props.removeReference(index)}
                      className={css(styles.icon) + ' fa fa-trash-o'}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  existingReferencesContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '22px',
  },
  referenceContainer: {
    width: '100%',
    borderRadius: '4px',
    display: 'flex',
  },
  reference: {
    background: '#F2F2F2',
    padding: '14px',
    boxSizing: 'border-box',
    width: '354px',
    textAlign: 'left',
    display: 'flex',
  },
  referenceNumber: {
    color: '#77787A',
    fontFamily: 'Lato',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  referenceInfo: {
    color: '#77787A',
    fontFamily: 'Lato',
    fontSize: '12px',
    leading: '1',
  },
  iconsContainer: {
    color: '#bfbfbf',
    background: '#E5E5E5',
    width: '85px',
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  icon: {
    cursor: 'pointer',
    ':hover': {
      color: '#848484',
    },
  },
});
