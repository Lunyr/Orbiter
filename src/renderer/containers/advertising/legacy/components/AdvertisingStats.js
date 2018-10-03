/***
 * Stats panel for advertising
 * @patr -- patrick@quantfive.org
 */

import React from 'react';
import Picker from 'react-month-picker';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import theme from '../../../theme';

// Stylesheets
import 'react-month-picker/css/month-picker.css';

export default class AdvertisingStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chosenDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
    };

    this.pickerLang = {
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      from: 'From',
      to: 'To',
    };
  }

  /***
   * Handles clicking the month box to pick a month
   * @params string ref -- the id of the picker clicked
   */
  handleClickMonthBox = ref => {
    this[ref].show();
  };

  /***
   * Handles change of the month
   * @params string year -- the year picked
   * @params string month -- the month picked
   * @params string ref -- the id of the picker
   */
  handleAMonthChange = (year, month, ref) => {
    var chosenDate = {
      year,
      month,
    };
    this.setState({
      chosenDate,
    });
    this.props.getStats(chosenDate);
    this[ref].dismiss();
  };

  /***
   * Turns the month + year object chosen into text
   * @params {m} -- the date consisting of month + year
   */
  makeText = m => {
    if (m && m.year && m.month) return this.pickerLang.months[m.month - 1] + ' ' + m.year;
    return '?';
  };

  render() {
    let advertising = this.props.advertisingCards.map((card, index) => {
      return (
        <div key={card.id} className={css(styles.reach, styles.statsCard)}>
          <div className={css(styles.header)}>
            <span className={css(styles.headerTitle)}>{card.headerTitle}</span>
            <span className="picker">
              <Picker
                ref={ref => (this[card.id] = ref)}
                years={[2017]}
                value={this.state.chosenDate}
                lang={this.pickerLang.months}
                className={css(styles.date)}
                onChange={(year, month) => this.handleAMonthChange(year, month, card.id)}
                onDismiss={this.handleAMonthDissmis}
              >
                <div
                  className={css(styles.monthPickerGroup)}
                  onClick={() => this.handleClickMonthBox(card.id)}
                >
                  <span className={css(styles.monthPicker)}>
                    {this.makeText(this.state.chosenDate)}
                  </span>
                  <i className={css(styles.caretDown) + ' fa fa-caret-down'} aria-hidden="true" />
                </div>
              </Picker>
            </span>
          </div>

          <div className={css(styles.body)}>
            <div className={css(styles.bodyHeader)}>{card.bodyHeader}</div>
            <div className={css(styles.bigNumber)}>{card.stat}</div>
          </div>
          {card.id === 'linkClicks' ? (
            <div className={css(styles.perDay)}>
              <div className={css(styles.avgPerDay)}>
                Average Per Day
                <div className={css(styles.number)}>{card.avgPerDay}</div>
              </div>
            </div>
          ) : null}
        </div>
      );
    });
    return <div className={css(styles.advertisingStats)}>{advertising}</div>;
  }
}

var styles = StyleSheet.create({
  advertisingStats: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Roboto',
    justifyContent: 'center',

    '@media only screen and (min-width: 320px)': {
      display: 'none',
    },

    '@media only screen and (min-width: 1024px)': {
      display: 'flex',
      width: '100%',
    },

    '@media only screen and (min-width: 1440px)': {
      width: '1240px',
    },
  },
  date: {
    cursor: 'pointer',
  },
  statsCard: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    background: theme.colors.white,
    borderRadius: '4px',
    width: '33%',
    margin: theme.spacing,
    height: 300,
    padding: 20,
  },
  headerTitle: {
    color: '#354052',
    fontWeight: '300',
    fontSize: '26px',
  },
  body: {
    marginTop: '66px',
  },
  monthPicker: {
    color: '#283141',
    opacity: '.6',
  },
  caretDown: {
    color: '#868C97',
    marginLeft: '10px',
  },
  bodyHeader: {
    fontSize: '14px',
    color: '#354052',
  },
  bigNumber: {
    fontWeight: '300',
    marginTop: '8px',
    '@media only screen and (min-width: 1024px)': {
      fontSize: '46px',
    },
    '@media only screen and (min-width: 1440px)': {
      fontSize: '66px',
    },
  },
  perDay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '45px',
    '@media only screen and (min-width: 1440px)': {
      marginTop: '60px',
    },
  },
  avgPerDay: {
    color: '#354052',
    fontSize: '14px',
  },
  number: {
    color: '#868C97',
    marginTop: '5px',
  },
  divider: {
    width: '22px',
    border: '1px solid #fff',
    opacity: '.6',
  },
});
