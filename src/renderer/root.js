import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import { addLocaleData, IntlProvider } from 'react-intl';
import { ThemeProvider } from 'react-jss';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '../shared/redux/store';
import theme from './theme/index';
import App from './containers/app';

// Add locales
import en from 'react-intl/locale-data/en';

addLocaleData([...en]);

// Create root component with injected localization
const LocalizedRoot = connect(({ locale }) => locale)(({ locale, messages }) => (
  <IntlProvider key={locale} locale={locale} messages={messages}>
    <Router>
      <Route component={App} />
    </Router>
  </IntlProvider>
));

// Initialize the redux store from the global state
const { store, persistor } = configureStore(remote.getGlobal('state'), 'orbiter-renderer');

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
