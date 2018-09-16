import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { ErrorBoundary } from '../../../components';
import DraftCreator from './DraftCreator';
import DraftEditor from './DraftEditor/';

const Draft = ({ intl }) => (
  <ErrorBoundary
    errorMsg={intl.formatMessage({
      id: 'editor_error',
      defaultMessage:
        "Oh no, something went wrong! It's okay though, please refresh and your content should return.",
    })}>
    <Switch>
      <Route strict={false} exact path="/draft/:uuid" component={DraftEditor} />
      <Route strict={false} exact path="/draft" component={DraftCreator} />
    </Switch>
  </ErrorBoundary>
);

export default injectIntl(Draft);
