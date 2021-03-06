import React from 'react';
import injectStyles from 'react-jss';
import { Doughnut } from 'react-chartjs-2';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';

class AdFrequency extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      LUNPool: 0,
      bidValue: 0,
    };
  }

  /***
   * Calculates the percentage of the LUN pool that you're bidding for
   */
  bidChange = (e) => {
    let bid = e.target.value ? e.target.value * 1 : 0;
    if (this.props.yourLunBalance <= 0) {
      this.props.messageActions.setMessage(
        "You don't have any LUN! Please purchase some from the link below.",
        'error',
        true
      );
      bid = 0;
    }
    if (bid > this.props.yourLunBalance * this.props.conversion) {
      bid = (this.props.yourLunBalance * this.props.conversion).toFixed(2);
    }

    this.setState({
      bidValue: bid,
    });

    if (bid > 0) {
      // this.props.timePct(this.props.startPeriod, this.props.endPeriod, bid / this.props.conversion);
      this.props.onChange('yourBidLun', bid / this.props.conversion);
      this.props.onChange('yourBid', bid * 1.0);
    }
  };

  render() {
    const { classes } = this.props;
    const chartData = {
      labels: ['Your ad', 'Other ads'],
      datasets: [
        {
          label: '% frequency',
          data: [this.props.percentLUNPool, 100 - this.props.percentLUNPool],
          backgroundColor: ['#628FE3', 'rgba(232, 232, 232, 1)'],
        },
      ],
    };

    const chartOptions = {
      responsive: false,
      cutoutPercentage: 82,
      legend: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    };

    const truePrice = this.props.conversion
      ? (this.state.bidValue / this.props.conversion).toFixed(5)
      : '0';

    return (
      <div className={classes.section}>
        <div className={classes.bidSection}>
          <div className={classes.placeBidHeader}>
            <FormattedMessage id="adfrequency_title" defaultMessage="Ad Frequency" />
          </div>
          <div className={classes.bidInfo}>
            <FormattedMessage
              id="adfrequency_bid"
              defaultMessage="Your ad will be displayed in proportion to how much you pay."
            />
            <br />
            <FormattedMessage
              id="adfrequency_bidHelp"
              defaultMessage="The more you pay, the more frequently your ad appears!"
            />
          </div>
          <div className={classes.auctionSection}>
            <div className={classes.bidFormat}>
              <div className={classes.choiceLabel}>
                <FormattedMessage id="adfrequency_yourBid" defaultMessage="Your bid" />
              </div>
              <div className={classes.bidChanges}>
                <div className={classes.yourBid}>
                  <div className={classes.dollarSign}>$</div>
                  <input
                    type="number"
                    value={this.state.bidValue}
                    max={String(this.props.yourLunBalance * this.props.conversion)}
                    ref={(ref) => (this.bid = ref)}
                    className={cx(classes.startDate, classes.bidInput)}
                    onChange={this.bidChange}
                    min="0.01"
                    step="0.01"
                  />
                </div>

                <div className={classes.truePrice}>
                  = {truePrice} <span className={classes.lun}> LUN </span>
                </div>
                <div className={classes.noLun}>
                  No LUN?
                  <a
                    href="https://coinmarketcap.com/currencies/lunyr/#market"
                    target="_blank"
                    className={classes.textStyles}
                    rel="noopener noreferrer">
                    <FormattedMessage
                      id="adfrequency_findLUN"
                      defaultMessage="Find LUN on these exchanges"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className={classes.auctionPool}>
              <div className={classes.choiceLabel}>
                <FormattedMessage
                  id="adfrequency_auctionPool"
                  defaultMessage="Current auction pool"
                />
              </div>
              <div className={classes.currentAuctionPool}>
                $ {(this.props.lunPool * this.props.conversion).toFixed(5)}
              </div>
              <div className={classes.currentAuctionLUN}>
                = {this.props.lunPool} <span className={classes.lun}>LUN</span>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.graphArea}>
          <div className={classes.graph}>
            <div className={classes.graphText}>
              <div className={classes.frequency}>{this.props.percentLUNPool}</div>
              <div className={classes.frequencyText}>
                <FormattedMessage id="adfrequency_percent" defaultMessage="Percent Frequency" />
              </div>
            </div>
            <Doughnut height={170} width={170} data={chartData} options={chartOptions} />
          </div>
          <div className={classes.graphExplanation}>
            <FormattedMessage
              id="adfrequency_currentValues"
              defaultMessage="Current values may change based on advertisers' contributions to the pool"
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  noLun: {
    display: 'flex',
    opacity: '.6',
    fontSize: '10px',
    alignItems: 'center',
    marginTop: '10px',
  },
  buttonStyles: {
    height: 'unset',
    width: 'unset',
    background: 'none',
    boxShadow: 'none',
    textDecoration: 'underline',
    marginLeft: '3px',
  },
  textStyles: {
    color: '#000',
    fontSize: '10px',
    paddingLeft: '5px',
  },
  section: {
    // borderBottom: '1px solid #eee',
    padding: '12.5px 25px',
  },
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
    marginTop: '5px',
  },
  durationChoices: {
    marginTop: '19px',
    display: 'flex',
  },
  bidChanges: {
    display: 'flex',
    // alignItems: 'center',
    flexDirection: 'column',
  },
  truePrice: {
    fontSize: '12px',
    color: '#354052',
    fontWeight: '300',
    margin: '5px 10px',
    opacity: '.6',
  },
  graphArea: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '25px',
  },
  graph: {
    position: 'relative',
    display: 'inline-block',
  },
  graphText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  graphExplanation: {
    color: '#354052',
    fontSize: '13px',
    opacity: '.6',
    marginLeft: '40px',
  },
  frequency: {
    fontSize: '36px',
  },
  frequencyText: {
    fontSize: '12px',
    color: '#354052',
    opacity: '.6',
  },
  startDate: {
    padding: '10px 5px',
    border: '1px solid #E5E5E5',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  yourBid: {
    position: 'relative',
  },
  bidInput: {
    cursor: 'auto',
    color: '#626DFF',
    fontSize: '26px',
    width: '180px',
    paddingLeft: '40px',
    boxSizing: 'border-box',
  },
  dollarSign: {
    position: 'absolute',
    color: '#626DFF',
    fontSize: '26px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 10px',
    borderRight: '1px solid #E5E5E5',
  },
  choiceLabel: {
    color: '#8D8E90',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  endsOnChoice: {
    marginLeft: '50px',
  },
  popover: {
    zIndex: '2',
  },
  placeBidHeader: {
    color: '#354052',
    fontSize: '20px',
  },
  bidInfo: {
    fontSize: '13px',
    color: '#354052',
    opacity: '.6',
    lineHeight: '18px',
    marginTop: '15px',
    marginBottom: '10px',
  },
  currentAuctionPool: {
    fontSize: '26px',
    fontWeight: '300',
    color: '#354052',
    wordBreak: 'break-word',
  },
  currentAuctionLUN: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#354052',
    opacity: '.6',
  },
  lun: {
    fontSize: '10px',
    color: '#BBBBBC',
  },
  auctionSection: {
    marginTop: '19px',
    display: 'flex',
    alignItems: 'center',
    '@media only screen and (max-width: 1024px)': {
      flexDirection: 'column',
    },
  },
  auctionPool: {
    marginLeft: '50px',
    '@media only screen and (max-width: 1024px)': {
      marginLeft: 0,
      marginTop: theme.spacing,
    },
  },
  slider: {
    marginTop: '30px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
});

export default injectStyles(styles)(AdFrequency);
