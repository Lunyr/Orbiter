import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import { addLocaleData, IntlProvider } from 'react-intl';
import { ThemeProvider } from 'react-jss';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '../shared/redux/store';
import theme from './theme/index';
import { App } from './containers';

// Add locales
import en from 'react-intl/locale-data/en';

addLocaleData([...en]);

// Create root component with injected localization
const LocalizedRoot = connect(({ locale }) => locale)(({ locale, messages }) => (
  <IntlProvider key={locale} locale={locale} messages={messages}>
    <Router>
      <Switch>
        {/* Add in additional top level routes */}
        <Route path="/" component={App} />
      </Switch>
    </Router>
  </IntlProvider>
));

// Initialize the redux store from the global state
const initialState = remote.getGlobal('state');
const { store, persistor } = configureStore(initialState, 'orbiter-renderer');

// Init application into DOM
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <LocalizedRoot />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.querySelector(document.currentScript.getAttribute('data-container'))
);
