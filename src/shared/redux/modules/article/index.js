import { combineReducers } from 'redux';
import draft from './draft/reducer';
import editor from './editor/reducer';
import reader from './reader/reducer';

/*
* Unify module reducers for a nested reducer state tree
*/

export default combineReducers({
  draft,
  editor,
  reader,
});
