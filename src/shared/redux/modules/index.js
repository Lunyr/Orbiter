import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import app from './app/reducer';
import auth from './auth/reducer';
import locale from './locale/reducer';

/*
* Unify module reducers for a single state tree
*/

export const reducers = combineReducers({
  app,
  auth,
  form,
  locale,
});
