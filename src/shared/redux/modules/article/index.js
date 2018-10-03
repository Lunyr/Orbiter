import { combineReducers } from 'redux';
import draft from './draft/reducer';
import proposals from './proposals/reducer';
import reader from './reader/reducer';
import review from './review/reducer';

/*
* Unify module reducers for a nested reducer state tree
*/

export default combineReducers({
  draft,
  proposals,
  reader,
  review,
});
