const PROMISE_ACTION_STATES = {
  START: 'START',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

/*
* Promise middleware to generate actions for async/promise based events
* Like redux-promise-middleware but a little simpler
*
* Takes an async action defined by a constant e.g, `namespace/ACTION` and generates the following:
*  - Start of promise, `namespace/ACTION_START`
*  - Success of promise, `namespace/ACTION_SUCCESS`
*  - Error of promise, `namespace/ACTION_ERROR`
*
*  NOTE: Assumes that we determine if an action is asyn if it contains a `payload` key that returns a function
*
 */

const promiseMiddleware = () => ({ dispatch }) => (next) => (action) => {
  const { payload } = action;

  const isPayloadAPromise = payload && typeof payload.then === 'function';

  // Handle backwards compat. with our other model
  if (!isPayloadAPromise) {
    return next(action);
  }

  /*
   * Handle async payload
   * `suffix` - `START` | `SUCCESS` | `FAILURE`
   */
  const actionCreator = (suffix, payload) => ({
    type: `${action.type}_${suffix}`,
    meta: { action },
    payload,
  });

  // Run the incoming payload function
  payload
    .then((response) => dispatch(actionCreator(PROMISE_ACTION_STATES.SUCCESS, response)))
    .catch((error) => dispatch(actionCreator(PROMISE_ACTION_STATES.ERROR, error)));

  // Return the initial start action
  return next(actionCreator(PROMISE_ACTION_STATES.START));
};

export default promiseMiddleware;
