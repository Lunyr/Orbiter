import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import cx from 'classnames';
import AdUIComponent from './AdUIComponent';

class CreateAdForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploadingPhoto: false,
      hash: '',
    };
  }

  render() {
    const { classes, intl, callToAction, title, body, onChange, url } = this.props;
    return (
      <div className={classes.body}>
        <div className={classes.section}>
          <div className={classes.header}>
            <div className={classes.headerTitle}>
              <FormattedMessage id="createad_header" defaultMessage="Ad Content" />
            </div>
            <div className={classes.headerNote}>
              <FormattedMessage id="createad_note" defaultMessage="NOTE: Keep it clean and nice" />
            </div>
          </div>
          <div className={classes.createAd}>
            <div className={classes.adui}>
              <AdUIComponent
                callToAction={callToAction}
                title={title}
                body={body}
                onChange={onChange}
              />
            </div>
            <div className={classes.content}>
              <div className={classes.firstRow}>
                <div className={classes.labelContainer}>
                  <div className={classes.label}>
                    <FormattedMessage id="createad_title" defaultMessage="Title" />
                  </div>
                  <input
                    onChange={(e) => onChange('title', e.target.value)}
                    className={cx(classes.input, classes.adTitle)}
                    value={title}
                    required
                  />
                </div>

                <div className={cx(classes.labelContainer, classes.actionLabelContainer)}>
                  <div className={classes.label}>
                    <FormattedMessage id="createad_cta" defaultMessage="Call to action label" />
                  </div>
                  <input
                    onChange={(e) => onChange('callToAction', e.target.value)}
                    value={callToAction}
                    className={cx(classes.input, classes.actionLabel)}
                    required
                  />
                </div>
              </div>
              <div className={classes.labelContainer}>
                <div className={classes.label}>
                  <FormattedMessage id="createad_bodyText" defaultMessage="Body text" />
                </div>
                <textarea
                  onChange={(e) => onChange('body', e.target.value)}
                  className={cx({
                    [classes.input]: true,
                    [classes.adBody]: true,
                  })}
                  placeholder={intl.formatMessage({
                    id: 'createad_maxChar',
                    defaultMessage: '160 characters max',
                  })}
                  value={body}
                  required
                />
              </div>
              <div className={classes.labelContainer}>
                <div className={classes.label}>URL</div>
                <input
                  onChange={(e) => onChange('url', e.target.value)}
                  required
                  placeholder={intl.formatMessage({
                    id: 'createad_clickthrough',
                    defaultMessage: 'Clickthrough website',
                  })}
                  ref={(ref) => (this.url = ref)}
                  className={cx(classes.input, classes.adInput)}
                  value={url}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
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
  adBody: {
    color: '#494D5F',
    fontSize: '14px',
    padding: theme.spacing,
    overflow: 'hidden',
    resize: 'none',
    height: 60,
  },
  buttonContainer: {
    textAlign: 'right',
  },
});

export default injectIntl(injectStyles(styles)(CreateAdForm));
