/***
 * Page 2 of ad modal -- Add Content
 * @patr -- patrick@quantfive.org
 */

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import mixpanel from 'mixpanel-browser';

// Components
import AdUIComponent from '../components/AdUIComponent';
import theme from '../../../theme';

class AddContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploadingPhoto: false,
      hash: '',
    };
  }

  /***
   * Set redux to the input
   * @params string value -- the value of the input
   * @params string key -- which input it is, the key to set in redux
   */
  sendToRedux = (value, key) => {
    if (key === 'url') {
      if (!value.includes('http')) {
        value = 'http://' + value;
      }
    }
    this.props.updateAdInfo(value, key);
  };

  /***
   * Make sure all fields are filled out then open the preview modal
   */
  preview = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.openAdPreviewModal(true);
    mixpanel.track('createAdPreview_button_clicked');
  };

  render() {
    const { intl } = this.props;
    return (
      <form className={css(styles.body)} onSubmit={this.preview}>
        <div className={css(styles.section)}>
          <div className={css(styles.header)}>
            <div className={css(styles.headerTitle)}>
              <FormattedMessage id="createad_header" defaultMessage="Ad Content" />
            </div>
            <div className={css(styles.headerNote)}>
              <FormattedMessage id="createad_note" defaultMessage="NOTE: Keep it clean and nice" />
            </div>
          </div>
          <div className={css(styles.createAd)}>
            <div className={css(styles.adui)}>
              <AdUIComponent
                edit={false}
                updateAdInfo={this.props.updateAdInfo}
                actionLabel={this.props.actionLabel}
                title={this.props.title}
                body={this.props.body}
                ipfsUpload={this.props.ipfsUpload}
                messageActions={this.props.messageActions}
              />
            </div>

            <div className={css(styles.content)}>
              <div className={css(styles.firstRow)}>
                <div className={css(styles.labelContainer)}>
                  <div className={css(styles.label)}>
                    <FormattedMessage id="createad_title" defaultMessage="Title" />
                  </div>
                  <input
                    onChange={e => this.sendToRedux(e.target.value, 'title')}
                    defaultValue={this.props.title}
                    className={css(styles.input, styles.adTitle)}
                    required
                  />
                </div>

                <div className={css(styles.labelContainer, styles.actionLabelContainer)}>
                  <div className={css(styles.label)}>
                    <FormattedMessage id="createad_cta" defaultMessage="Call to action label" />
                  </div>
                  <input
                    onChange={e => this.sendToRedux(e.target.value, 'actionLabel')}
                    defaultValue={this.props.actionLabel}
                    className={css(styles.input, styles.actionLabel)}
                    required
                  />
                </div>
              </div>
              <div className={css(styles.labelContainer)}>
                <div className={css(styles.label)}>
                  <FormattedMessage id="createad_bodyText" defaultMessage="Body text" />
                </div>
                <textarea
                  defaultValue={this.props.body}
                  onChange={e => this.sendToRedux(e.target.value, 'body')}
                  className={css(styles.input, styles.adBody)}
                  placeholder={intl.formatMessage({
                    id: 'createad_maxChar',
                    defaultMessage: '160 characters max',
                  })}
                  required
                />
              </div>
              <div className={css(styles.labelContainer)}>
                <div className={css(styles.label)}>URL</div>
                <input
                  onChange={e => this.sendToRedux(e.target.value, 'url')}
                  required
                  placeholder={intl.formatMessage({
                    id: 'createad_clickthrough',
                    defaultMessage: 'Clickthrough website',
                  })}
                  ref={ref => (this.url = ref)}
                  className={css(styles.input, styles.adInput)}
                />
              </div>
              <div className={css(styles.buttonContainer)}>
                <button className={css(styles.previewButton)}>
                  <FormattedMessage id="createad_preview" defaultMessage="Preview" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    borderTop: '1px solid #eee',
    '@media only screen and (min-width: 1024px)': {
      width: '50%',
      borderTop: 'none',
      borderRight: '1px solid #eee',
    },
  },
  section: {
    margin: '0 auto',
    padding: '12.5px 25px',
  },
  labelContainer: {
    width: '100%',
    flex: '1',
    marginBottom: '15px',
    '@media only screen and (min-width: 1024px)': {
      width: 'unset',
    },
  },
  actionLabelContainer: {
    '@media only screen and (min-width: 1024px)': {
      paddingLeft: '20px',
    },
  },
  adui: {
    margin: '25px 0px',
    width: '100%',
    '@media only screen and (min-width: 1024px)': {
      marginTop: '47px',
      marginBottom: '70px',
    },
  },
  createAd: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  content: {
    paddingBottom: '15px',
    width: '100%',
  },
  firstRow: {
    '@media only screen and (min-width: 768px)': {
      display: 'flex',
    },
  },
  adBody: {
    color: '#494D5F',
    fontSize: '14px',
    padding: '10px',
    overflow: 'hidden',
    resize: 'none',
    height: '60px',
  },
  headerTitle: {
    color: '#354052',
    fontSize: '20px',
  },
  headerNote: {
    color: '#354052',
    opacity: '.6',
    fontSize: '13px',
    paddingTop: '5px',
  },
  label: {
    color: '#3A3C49',
    fontSize: '14px',
    marginBottom: '3px',
    '@media only screen and (min-width: 1024px)': {
      display: 'block',
    },
  },
  input: {
    height: '42px',
    border: '1px solid rgba(0, 0, 0, .1)',
    borderRadius: '4px',
    fontSize: '14px',
    padding: '0px 10px',
    width: 'calc(100% - 20px)',
  },
  buttonContainer: {
    textAlign: 'right',
  },
  previewButton: {
    ...theme.buttons.inverse,
    marginTop: theme.spacing,
    '@media only screen and (max-width: 1024px)': {
      display: 'none',
    },
  },
});

export default injectIntl(AddContent);
