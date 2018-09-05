import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import app from './app/reducer';
import article from './article/';
import auth from './auth/reducer';
import explorer from './explorer/reducer';
import feed from './feed/reducer';
import locale from './locale/reducer';
import search from './search/reducer';

/*
* Unify module reducers for a single state tree
*/

export const reducers = combineReducers({
  app,
  article,
  auth,
  explorer,
  feed,
  form,
  locale,
  search,
});
