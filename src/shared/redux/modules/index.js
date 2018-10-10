import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import advertising from './advertising/reducer';
import app from './app/reducer';
import article from './article/';
import auth from './auth/reducer';
import blog from './blog/reducer';
import chain from './chain/reducer';
import drafts from './drafts/reducer';
import explorer from './explorer/reducer';
import feed from './feed/reducer';
import locale from './locale/reducer';
import search from './search/reducer';
import tagging from './tagging/reducer';
import wallet from './wallet/reducer';

/*
* Unify module reducers for a single state tree
*/

export const reducers = combineReducers({
  advertising,
  app,
  article,
  auth,
  blog,
  chain,
  drafts,
  explorer,
  feed,
  form,
  locale,
  search,
  tagging,
  wallet,
});
