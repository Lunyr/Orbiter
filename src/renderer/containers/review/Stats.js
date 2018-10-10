import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectStyles from 'react-jss';
import { Doughnut } from 'react-chartjs-2';
import cx from 'classnames';

class Stats extends React.Component {
  render() {
    const { stats, classes, intl } = this.props;

    if (!stats) {
      return null;
    }

    const { reviewed, submitted, unreviewed, accepted, rejected, inReview } = stats;

    const acceptedLabel = intl.formatMessage({
      id: 'unreviewed_accepted',
      defaultMessage: 'Accepted',
    });

    const rejectedLabel = intl.formatMessage({
      id: 'unreviewed_rejected',
      defaultMessage: 'Rejected',
    });

    const inReviewLabel = intl.formatMessage({
      id: 'unreviewed_inreview',
      defaultMessage: 'In Review',
    });

    const chartData = {
      labels: [acceptedLabel, rejectedLabel, inReviewLabel],
      datasets: [
        {
          label: intl.formatMessage({
            id: 'unreviewed_submitted',
            defaultMessage: 'Number Of Submitted Articles',
          }),
          data: [accepted, rejected, inReview],
          backgroundColor: ['rgba(109, 183, 29, 1)', 'rgba(232, 232, 232, 1)', '#628FE3'],
        },
      ],
    };

    const chartOptions = {
      responsive: false,
      cutoutPercentage: 92,
      legend: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    };

    let numReviewed = submitted - unreviewed;
    numReviewed = numReviewed > 0 ? numReviewed : 0;
    return (
      <div className={classes.statsContainer}>
        <div className={classes.unreviewedArticleStats}>
          <span className={classes.unreviewedStatsInfo}>
            <FormattedMessage
              id="unreviewed_description"
              defaultMessage={`Here is a list of articles that need 3 good reviews in order to get published. You can
            help by reviewing some of these, building Lunyr Knowledge base, and helping authors
            improve their articles.`}
            />
          </span>
          <div className={classes.articlesStats}>
            <div className={classes.numbersContainer}>
              <span className={classes.number}>{numReviewed}</span>
              <span className={classes.label}>
                <FormattedMessage id="unreviewed_reviewed" defaultMessage="Reviewed" />
              </span>
            </div>
            <div className={classes.numbersContainer}>
              <span className={classes.number}>{unreviewed}</span>
              <span className={classes.label}>
                <FormattedMessage id="unreviewed_unreviewed" defaultMessage="Unreviewed" />
              </span>
            </div>
            <div className={classes.numbersContainer}>
              <span className={classes.number}>{submitted}</span>
              <span className={classes.label}>
                <FormattedMessage id="unreviewed_submitted" defaultMessage="Submitted" />
              </span>
            </div>
          </div>
        </div>
        <div className={classes.userStatsContainer}>
          <div className={classes.statsHeader}>
            <span className={cx(classes.userStatsHeading, classes.statsHeader)}>
              <FormattedMessage id="unreviewed_yourStats" defaultMessage="Your Stats" />
            </span>
          </div>
          <div className={classes.userStats}>
            <div className={classes.graph}>
              <div className={classes.submittedText}>
                <span className={classes.numSubmitted}> {accepted + rejected + inReview} </span>
                <span className={classes.submitted}>
                  <FormattedMessage id="unreviewed_submitted" defaultMessage="Submitted" />
                </span>
              </div>
              <Doughnut height={150} width={150} data={chartData} options={chartOptions} />
            </div>
            <div className={classes.legend}>
              <span className={classes.userStatsHeading}>Accepted Articles</span>
              <span className={classes.reviewRate}>{accepted} </span>
              <div className={classes.labelContainer}>
                <div className={classes.submittedDot} />
                <span className={classes.userStatsLabel}>
                  <FormattedMessage id="unreviewed_rejected" defaultMessage="Rejected" />
                </span>
              </div>
              <div className={classes.labelContainer}>
                <div className={classes.reviewedDot} />
                <span className={classes.userStatsLabel}>
                  <FormattedMessage id="unreviewed_accepted" defaultMessage="Accepted" />
                </span>
              </div>
              <div className={classes.labelContainer}>
                <div className={cx(classes.reviewedDot, classes.inReviewDot)} />
                <span className={classes.userStatsLabel}>
                  <FormattedMessage id="unreviewed_inreview" defaultMessage="In Review" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  statsContainer: {
    display: 'flex',
    marginTop: theme.spacing * 2,
    marginBottom: theme.spacing * 2,
  },
  statsHeader: {
    textAlign: 'center',
    fontSize: '18px',
    letterSpacing: '.5px',
    fontWeight: '400',
    textTransform: 'none',
  },
  unreviewedArticleStats: {
    width: '100%',
    background: 'linear-gradient(137.43deg, #628FE3 0%, #6589DE 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: '0px 26.5px 0 34px',
    boxSizing: 'border-box',
    justifyContent: 'center',
    ...theme.typography.body,
  },
  graph: {
    position: 'relative',
  },
  submittedText: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.typography.body,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#3C394C',
  },
  numSubmitted: {
    fontSize: '36px',
    fontWeight: '300',
    opacity: '.8',
  },
  submitted: {
    opacity: '.4',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '.5px',
  },
  unreviewedStatsTitle: {
    ...theme.typography.body,
    color: '#fff',
    fontSize: '36px',
    fontWeight: '300',
    marginBottom: '5px',
  },
  unreviewedStatsInfo: {
    color: '#fff',
    opacity: '.6',
    fontFamily: 'Roboto',
    fontSize: '14px',
    lineHeight: '19px',
  },
  number: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: '40px',
    fontWeight: '300',
  },
  label: {
    ...theme.typography.body,
    textTransform: 'uppercase',
    color: '#fff',
    opacity: '.5',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  numbersContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    alignItems: 'center',
  },
  articlesStats: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  userStatsContainer: {
    background: '#fff',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '32px',
    paddingLeft: '31px',
    boxSizing: 'border-box',
  },
  userStatsHeading: {
    ...theme.typography.body,
    color: '#626DFF',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '.5px',
  },
  userStats: {
    width: '100%',
    display: 'flex',
    marginTop: '33px',
    marginBottom: '33px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '70px',
  },
  reviewRate: {
    color: '#3C394C',
    fontFamily: 'Roboto',
    fontSize: '26px',
    opacity: '.8',
    marginBottom: '10px',
    marginTop: '10px',
    textAlign: 'center',
  },
  submittedDot: {
    height: '6px',
    width: '6px',
    borderRadius: '100%',
    background: '#E8E8E8',
  },
  reviewedDot: {
    height: '6px',
    width: '6px',
    borderRadius: '100%',
    background: '#6DB71D',
  },
  inReviewDot: {
    background: 'linear-gradient(137.43deg, #628FE3 0%, #6589DE 100%)',
  },
  userStatsLabel: {
    ...theme.typography.body,
    opacity: '.4',
    color: '#3C394C',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: '5px',
    letterSpacing: '.5px',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '10px',
  },
});

export default injectIntl(injectStyles(styles)(Stats));
