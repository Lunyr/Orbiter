import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import promiseMiddleware from '../middleware/promiseMiddleware';
import forwardToMain from '../middleware/forwardToMain';
import forwardToRenderer from '../middleware/forwardToRenderer';
import triggerAlias from '../middleware/triggerAlias';
import replayMainAction from '../helpers/replayMainAction';
import replayRendererAction from '../helpers/replayRendererAction';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { reducers as appReducer } from '../modules/index';

export const isProduction = process.env.NODE_ENV === 'production';

const createMiddleware = (isRendererStore) => {
  return isRendererStore
    ? [forwardToMain, promiseMiddleware()]
    : [triggerAlias, promiseMiddleware(), forwardToRenderer];
};
/**
 * Returns a redux store when running in development mode
 */
const developmentStore = (reducer, initialState, isRendererStore) => {
  const middleware = createMiddleware(isRendererStore);
  const enhancers = composeWithDevTools(applyMiddleware(...middleware));
  return createStore(reducer, initialState, enhancers);
};

/**
 * Returns a redux store when running in production mode
 */
const productionStore = (reducer, initialState, isRendererStore) => {
  const middleware = createMiddleware(isRendererStore);
  return createStore(reducer, initialState, applyMiddleware(...middleware));
};

/**
 * Returns a map containing a redux store and persistor based on `initialState` and `options`
 */
const configureStore = (initialState, storeKey, isRendererStore = true) => {
  // Ensure we clear out the state when we logout
  const rootReducer = (state, action) => {
    if (action.type === 'auth/LOGOUT') {
      state = undefined;
    }
    return appReducer(state, action);
  };

  if (isRendererStore) {
    const persistanceConfiguration = {
      key: storeKey,
      storage,
      stateReconciler: autoMergeLevel2,
      blacklist: ['forms'],
    };

    const persistedReducer = persistReducer(persistanceConfiguration, rootReducer);

    const store = isProduction
      ? productionStore(persistedReducer, initialState, isRendererStore)
      : developmentStore(persistedReducer, initialState, isRendererStore);

    // Post to main store
    replayRendererAction(store);
    return { store, persistor: persistStore(store) };
  } else {
    const store = isProduction
      ? productionStore(rootReducer, initialState, isRendererStore)
      : developmentStore(rootReducer, initialState, isRendererStore);

    // Post to renderer store
    replayMainAction(store);
    return { store };
  }
};

export { configureStore };
