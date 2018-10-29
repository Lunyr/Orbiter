import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import Popover from 'react-popover';
import Calendar from 'react-calendar';
import cx from 'classnames';
import { FaAngleDown as AngleDownIcon } from 'react-icons/fa';

class AdDuration extends React.Component {
  state = {
    endsOnPopover: false,
    startsOnPopover: false,
  };

  render() {
    const { classes, startsOn, endsOn, onChange, nextAdPeriod } = this.props;
    const { endsOnPopover, startsOnPopover } = this.state;
    return (
      <div className={classes.section}>
        <div className={classes.body}>
          <div className={classes.selectASlot}>
            <div className={classes.selectTitle}>
              <FormattedMessage id="selectslot_title" defaultMessage="Ad duration" />
            </div>
            <div className={classes.selectNote}>
              <FormattedMessage
                id="selectslot_note"
                defaultMessage="NOTE: These are available predefined slots built to optimize ad performance"
              />
            </div>
          </div>
          <div className={classes.durationChoices}>
            <div className={classes.choice}>
              <div className={classes.choiceLabel}>
                <FormattedMessage id="selectslot_startOn" defaultMessage="Starting On" />
              </div>
              <Popover
                className={classes.popover}
                body={
                  <Calendar
                    onChange={onChange.bind(this, 'startsOn')}
                    value={startsOn}
                    minDate={nextAdPeriod}
                    activeStartDate={nextAdPeriod}
                  />
                }
                preferPlace="below"
                target={this.startingOnInput}
                onOuterAction={() => this.setState({ startsOnPopover: false })}
                isOpen={startsOnPopover}>
                <div
                  className={classes.inputContainer}
                  onClick={() => this.setState({ startsOnPopover: true })}>
                  <input
                    value={startsOn ? startsOn.toDateString() : null}
                    className={classes.startDate}
                    required={true}
                    ref={(ref) => (this.startingOnInput = ref)}
                    placeholder={nextAdPeriod ? nextAdPeriod.toDateString() : null}
                  />
                  <AngleDownIcon className={classes.downArrow} />
                </div>
              </Popover>
            </div>

            <div className={cx(classes.choice, classes.endsOnChoice)}>
              <div className={classes.choiceLabel}>
                <FormattedMessage id="selectslot_endsOn" defaultMessage="Ends On" />
              </div>
              <Popover
                className={classes.popover}
                body={
                  <Calendar
                    onChange={onChange.bind(this, 'endsOn')}
                    value={endsOn}
                    minDate={startsOn}
                  />
                }
                preferPlace="below"
                target={this.endsOnInput}
                onOuterAction={() => this.setState({ endsOnPopover: false })}
                isOpen={endsOnPopover}>
                <div
                  className={classes.inputContainer}
                  onClick={() => this.setState({ endsOnPopover: true })}>
                  <input
                    value={endsOn ? endsOn.toDateString() : null}
                    className={classes.startDate}
                    required={true}
                    ref={(ref) => (this.endsOnInput = ref)}
                    placeholder={endsOn.toDateString()}
                  />
                  <AngleDownIcon className={classes.downArrow} />
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  section: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding: '12.5px 25px',
    fontFamily: 'Roboto',
  },
  body: {},
  divider: {
    border: '1px solid #eee',
    margin: '25px 0px',
  },
  createAnAd: {
    fontSize: '26px',
    fontWeight: '300',
  },
  selectTitle: {
    color: '#354052',
    fontSize: '20px',
  },
  selectNote: {
    color: '#354052',
    opacity: '.6',
    fontSize: '13px',
    paddingTop: '5px',
  },
  durationChoices: {
    marginTop: '19px',
    display: 'flex',
    flexDirection: 'column',
  },
  startDate: {
    padding: '10px 5px',
    border: '1px solid #E5E5E5',
    borderRadius: '4px',
    cursor: 'pointer',

    '@media only screen and (min-width: 1024px)': {
      width: '180px',
    },

    '::-webkit-input-placeholder': {
      color: '#A5A5A7',
    },
    '::-moz-placeholder': {
      /* Firefox 19+ */
      color: '#A5A5A7',
    },
    ':-ms-input-placeholder': {
      /* IE 10+ */
      color: '#A5A5A7',
    },
    ':-moz-placeholder': {
      /* Firefox 18- */
      color: '#A5A5A7',
    },
  },
  inputContainer: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  downArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '20px',
  },
  bidInput: {
    cursor: 'auto',
    color: '#626DFF',
    fontSize: '26px',
    paddingLeft: '10px',
    width: '65px',
  },
  choiceLabel: {
    color: '#8D8E90',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  endsOnChoice: {
    marginTop: '20px',
  },
  popover: {
    zIndex: '2',
  },
});

export default injectStyles(styles)(AdDuration);
