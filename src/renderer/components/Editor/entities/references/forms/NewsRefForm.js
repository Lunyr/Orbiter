/***
 * form for inputting news references
 * @craiglu
 */

import React from 'react';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';

export default class NewsRefForm extends React.Component {
  submit = event => {
    event.preventDefault();
    if (this.props.edit) {
      this.props.editReference(this.props.index);
    } else {
      this.props.submitReference();
    }
    this.props.renderReferences();
  };

  render() {
    return (
      <form className={css(styles.formContainer)} onSubmit={this.submit}>
        <div className={css(styles.formFieldsContainer)}>
          <div className={css(styles.leftColumn)}>
            <div className={css(styles.inputContainer)}>
              <span className={css(styles.inputLabel)}>URL*</span>
              <input
                className={css(styles.input)}
                onClick={this.props.focus}
                onChange={this.props.onUrlChange}
                value={this.props.reference.url}
                required
              />
            </div>
            <div className={css(styles.inputContainer)}>
              <span className={css(styles.inputLabel)}>Source title*</span>
              <input
                className={css(styles.input)}
                onClick={this.props.focus}
                onChange={this.props.onSourceTitleChange}
                value={this.props.reference.sourceTitle}
                required
              />
            </div>
            <div className={css(styles.inputContainer)}>
              <span className={css(styles.inputLabel)}>Name of publication</span>
              <input
                className={css(styles.input)}
                onClick={this.props.focus}
                onChange={this.props.onNameOfPubChange}
                value={this.props.reference.nameOfPub}
              />
            </div>
          </div>
          <div className={css(styles.rightColumn)}>
            <div className={css(styles.inputContainer)}>
              <span className={css(styles.inputLabel)}>First name</span>
              <input
                className={css(styles.input)}
                onClick={this.props.focus}
                onChange={this.props.onFirstNameChange}
                value={this.props.reference.firstName}
              />
            </div>
            <div className={css(styles.inputContainer)}>
              <span className={css(styles.inputLabel)}>Last name</span>
              <input
                className={css(styles.input)}
                onClick={this.props.focus}
                onChange={this.props.onLastNameChange}
                value={this.props.reference.lastName}
              />
            </div>
            <div className={css(styles.inputContainer)}>
              <span className={css(styles.inputLabel)}>Date</span>
              <input
                className={css(styles.input)}
                onClick={this.props.focus}
                onChange={this.props.onDateChange}
                value={this.props.reference.date}
              />
            </div>
          </div>
        </div>
        <div className={css(styles.submissionContainer)}>
          <span className={css(styles.cancel)} onClick={this.props.renderReferences}>
            Cancel
          </span>
          <button className={css(styles.save)}>Save</button>
        </div>
      </form>
    );
  }
}

var styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '32px',
    boxSizing: 'border-box',
  },
  formFieldsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  inputLabel: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: '500',
    opacity: '.4',
    lineHeight: '10px',
    marginBottom: '3px',
  },
  input: {
    border: 'none',
    borderRadius: '4px',
    background: '#F2F2F2',
    fontFamily: 'Roboto',
    fontSize: '16px',
    width: '200px',
    height: '48px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    padding: '10px',
  },
  submissionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: '37px',
  },
  save: {
    background: '#F2F2F2',
    borderRadius: '4px',
    outline: 'none',
    border: 'none',
    fontFamily: 'Roboto',
    fontSize: '14px',
    color: '#3A3B4A',
    width: '142px',
    height: '48px',
    cursor: 'pointer',
  },
  cancel: {
    color: '#3A3B4A',
    fontFamily: 'Roboto',
    fontSize: '14px',
    opacity: '.4',
    marginRight: '14px',
    cursor: 'pointer',
  },
});
