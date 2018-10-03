import React from 'react';
import injectStyles from 'react-jss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import { MdRefresh as RefreshIcon } from 'react-icons/md';
import { fetchInReviewProposals } from '../../../shared/redux/modules/article/proposals/actions';
import {
  ArticleCard,
  ErrorBoundary,
  EmptyPlaceholder,
  IconButton,
  InstantLoadingIndicator,
  Placeholders,
  Grid,
} from '../../components';
import Stats from './Stats';
import styles from './styles';

class PeerReview extends React.Component {
  state = {
    gridView: true,
    windowWidth: window.innerWidth,
  };

  updateWidth = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  load = () => {
    this.props.fetchInReviewProposals(1000, 0);
  };

  navigateToProposal = ({ proposalId, title }) => {
    this.props.history.replace(`/review/${proposalId}/${title}`);
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.updateWidth);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  render() {
    const { classes, data, error, isFetching } = this.props;
    return (
      <ErrorBoundary error={error}>
        <div className={classes.container}>
          <div className={classes.inner}>
            <div className={classes.header}>
              <div className={classes.header__left}>
                <h1 className={classes.header__title}>
                  <FormattedMessage id="proposals_header" defaultMessage="Peer Review" />
                </h1>
                <p className={classes.header__help}>
                  Below is a grid of articles that are going through the proposal process. You can
                  review click and review the articles.
                </p>
                <Stats
                  counts={{
                    reviewed: 0,
                    submitted: 0,
                    unreviewed: data ? data.length : 0,
                  }}
                  stats={{
                    accepted: 0,
                    rejected: 0,
                    inReview: data ? data.length : 0,
                  }}
                />
              </div>
            </div>
            <InstantLoadingIndicator
              className={classes.content}
              watch={isFetching}
              load={this.load}>
              {(isLoading) => (
                <ReactPlaceholder
                  customPlaceholder={<Placeholders.GridViewPlaceholder />}
                  ready={!isLoading}
                  showLoadingAnimation>
                  {data.length > 0 ? (
                    <Grid>
                      {data.map((proposal) => (
                        <ArticleCard
                          key={proposal.id}
                          article={proposal}
                          onClick={this.navigateToProposal.bind(this, proposal)}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <EmptyPlaceholder>
                      <IconButton
                        type="button"
                        theme="text"
                        onClick={this.load}
                        icon={<RefreshIcon size={30} />}
                      />
                    </EmptyPlaceholder>
                  )}
                </ReactPlaceholder>
              )}
            </InstantLoadingIndicator>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ article: { proposals }, auth }) => ({
  auth,
  ...proposals,
});

const mapDispatchToProps = {
  fetchInReviewProposals,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectStyles(styles)(PeerReview))
);
