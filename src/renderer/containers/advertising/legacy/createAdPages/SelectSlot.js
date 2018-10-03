/***
 * Page 3 of ad modal -- select a slot
 * @patr -- patrick@quantfive.org
 */

import React from 'react';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import Popover from 'react-popover';
import Calendar from 'react-calendar';
import { FormattedMessage } from 'react-intl';

// Stylesheets
import '../stylesheets/CreateAdModal.css';

class SelectSlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startingOnDate: null,
      startingOn: false,
      endsOn: false,
      endsOnDate: null,
    };
  }

  /***
   * Changes the starting date
   * @param date -- the date chosen
   */
  startingOnChange = date => {
    this.setState({
      startingOn: false,
      startingOnDate: date,
    });

    this.props.updateAdInfo(date, 'startsOn');
  };

  /***
   * Changes the starting date
   * @param date -- the date chosen
   */
  endsOnChange = date => {
    this.setState({
      endsOn: false,
      endsOnDate: date,
    });

    this.props.updateAdInfo(date, 'endsOn');
  };

  /***
   * Updates the main container with the bid and select information and moves the next page
   */
  nextPage = () => {
    this.props.selectSlot(this.state.startingOnDate, this.state.endsOnDate, this.bid.value);
    this.props.nextPage();
  };

  render() {
    var endsOnDay = new Date();
    if (this.state.startingOnDate) {
      endsOnDay = new Date(this.state.startingOnDate.getTime());
      endsOnDay.setDate(this.state.startingOnDate.getDate() + this.props.adPeriodInDays);
    } else {
      if (this.props.nextAdPeriod) {
        endsOnDay = new Date(this.props.nextAdPeriod.getTime());
        endsOnDay.setDate(endsOnDay.getDate() + this.props.adPeriodInDays);
      }
    }

    return (
      <div className={css(styles.section)}>
        <div className={css(styles.body)}>
          <div className={css(styles.selectASlot)}>
            <div className={css(styles.selectTitle)}>
              <FormattedMessage id="selectslot_title" defaultMessage="Ad duration" />
            </div>
            <div className={css(styles.selectNote)}>
              <FormattedMessage
                id="selectslot_note"
                defaultMessage="NOTE: These are available predefined slots built to optimize ad performance"
              />
            </div>
          </div>
          <div className={css(styles.durationChoices)}>
            <div className={css(styles.choice)}>
              <div className={css(styles.choiceLabel)}>
                <FormattedMessage id="selectslot_startOn" defaultMessage="Starting On" />
              </div>
              <Popover
                className={css(styles.popover)}
                body={
                  <Calendar
                    onChange={this.startingOnChange}
                    minDate={this.props.nextAdPeriod}
                    activeStartDate={this.props.nextAdPeriod}
                  />
                }
                preferPlace="below"
                target={this.startingOnInput}
                onOuterAction={() => this.setState({ startingOn: false })}
                isOpen={this.state.startingOn}
              >
                <div
                  className={css(styles.inputContainer)}
                  onClick={() => this.setState({ startingOn: true })}
                >
                  <input
                    value={
                      this.state.startingOnDate ? this.state.startingOnDate.toDateString() : null
                    }
                    className={css(styles.startDate)}
                    required={true}
                    ref={ref => (this.startingOnInput = ref)}
                    placeholder={
                      this.props.nextAdPeriod ? this.props.nextAdPeriod.toDateString() : null
                    }
                  />
                  <i className={css(styles.downArrow) + ' fa fa-angle-down'} aria-hidden="true" />
                </div>
              </Popover>
            </div>

            <div className={css(styles.choice, styles.endsOnChoice)}>
              <div className={css(styles.choiceLabel)}>
                <FormattedMessage id="selectslot_endsOn" defaultMessage="Ends On" />
              </div>
              <Popover
                className={css(styles.popover)}
                body={
                  <Calendar
                    onChange={this.endsOnChange}
                    minDate={endsOnDay}
                    activeStartDate={endsOnDay}
                  />
                }
                preferPlace="below"
                target={this.endsOnInput}
                onOuterAction={() => this.setState({ endsOn: false })}
                isOpen={this.state.endsOn}
              >
                <div
                  className={css(styles.inputContainer)}
                  onClick={() => this.setState({ endsOn: true })}
                >
                  <input
                    value={this.state.endsOnDate ? this.state.endsOnDate.toDateString() : null}
                    className={css(styles.startDate)}
                    required={true}
                    ref={ref => (this.endsOnInput = ref)}
                    placeholder={endsOnDay.toDateString()}
                  />
                  <i className={css(styles.downArrow) + ' fa fa-angle-down'} aria-hidden="true" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
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

export default SelectSlot;
