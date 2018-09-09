import React from 'react';
import { remote } from 'electron';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { addLocaleData, IntlProvider } from 'react-intl';
import { ThemeProvider } from 'react-jss';
import { connect, Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from './shared/redux/store/index';
import theme from './renderer/theme/index';
import App from './renderer/containers/app';

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
const { store, persistor } = configureStore({}, 'orbiter-renderer');

const Root = hot(module)(() => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ThemeProvider theme={theme}>
        <LocalizedRoot />
      </ThemeProvider>
    </PersistGate>
  </Provider>
));

// Init application into DOM
ReactDOM.render(<Root />, document.getElementById('root'));
