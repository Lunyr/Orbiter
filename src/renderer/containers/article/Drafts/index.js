import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { withRouter } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import { MdRefresh as RefreshIcon } from 'react-icons/md';
import {
  ArticleCard,
  Button,
  ErrorBoundary,
  EmptyPlaceholder,
  IconButton,
  InstantLoadingIndicator,
  Grid,
  Link,
  Placeholders,
} from '../../../components/';
import { fetchDrafts } from '../../../../shared/redux/modules/drafts/actions';
import styles from './styles';

class Drafts extends React.Component {
  navigateToDraft = ({ uuid }) => {
    this.props.history.push(`/draft/${uuid}`);
  };

  load = () => {
    this.props.fetchDrafts();
  };

  render() {
    const { classes, isFetchingDrafts, drafts, numberOfDrafts, error } = this.props;
    return (
      <ErrorBoundary error={error}>
        <InstantLoadingIndicator
          className={classes.container}
          watch={isFetchingDrafts}
          load={this.load}>
          {(isLoading) => (
            <ReactPlaceholder
              customPlaceholder={<Placeholders.GridViewPlaceholder />}
              ready={!isLoading}
              showLoadingAnimation>
              {drafts.length > 0 ? (
                <div className={classes.container}>
                  <header className={classes.header}>
                    <h1 className={classes.title}>
                      My Drafts
                      <span className={classes.numberOfDrafts}>({numberOfDrafts})</span>
                    </h1>
                    <IconButton
                      className={classes.refresh}
                      type="button"
                      theme="text"
                      onClick={this.load}
                      icon={<RefreshIcon size={25} />}
                    />
                  </header>
                  <Grid>
                    {drafts.map((draft) => (
                      <ArticleCard
                        key={draft.id}
                        article={draft}
                        onClick={this.navigateToDraft.bind(this, draft)}
                      />
                    ))}
                  </Grid>
                </div>
              ) : (
                <EmptyPlaceholder>
                  <Link to="/draft">
                    <Button theme="primary" value="Create Draft" />
                  </Link>
                </EmptyPlaceholder>
              )}
            </ReactPlaceholder>
          )}
        </InstantLoadingIndicator>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ drafts: { data: drafts, loading: isFetchingDrafts, error } }) => ({
  drafts: !drafts ? [] : drafts,
  error,
  isFetchingDrafts,
  numberOfDrafts: drafts ? drafts.length : 0,
});

const mapDispatchToProps = {
  fetchDrafts,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectStyles(styles)(Drafts))
);
