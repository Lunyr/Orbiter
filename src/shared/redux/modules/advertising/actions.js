import { Web3API } from '../../../../backend/api';
import createTriggerAlias from '../../helpers/createTriggerAlias';

const actions = {
  AD_INFORMATION: 'advertising/AD_INFORMATION',
  FETCH: 'advertising/GET_ADS',
  APPEND_ADS: 'advertising/APPEND_ADS',
  GET_STATS: 'advertising/GET_STATS',
};

/**
 * Fetches the ads in lunyr
 */
export const fetchAds = createTriggerAlias(actions.FETCH, () => ({
  type: actions.FETCH,
  payload: Web3API.fetchAds(),
}));

/*
export const AdvertisingActions = {
  
  setAdInformation = (value, key) => {
  return (dispatch) => {
    var info = {
      type: actions.AD_INFORMATION,
    };
    info[key] = value;
    return dispatch(info);
  },
  
  postAdInformation: txhashes => {
    return (dispatch, getState) => {
      var params = {
        ...getState().advertising,
        cost: 0,
        reach: 0,
        clicks: 0,
        txhashes,
      };
      return fetch(API.ADVERTISING, API.POST_CONFIG(params))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(json => {
          return { error: false, msg: 'ok' };
        })
        .catch(error => {
          if (error.response) {
            return dispatch(ErrorActions.setError(error.response));
          } else {
            console.log(error);
            
            return { error: false, msg: 'An error occured!' };
          }
        });
    };
  },
  
  getAllAds: (limit, offset) => {
    return dispatch => {
      return fetch(`${API.ADVERTISING}/${limit}/${offset}`, API.GET_CONFIG)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(json => {
          return dispatch({
            type: offset === 0 ? AdvertisingConstants.GET_ADS : AdvertisingConstants.APPEND_ADS,
            ads: json.ads,
          });
        })
        .catch(error => {
          if (error.response) {
            return dispatch(ErrorActions.setError(error.response));
          } else {
            console.log(error);
            return 'An error occured!';
          }
        });
    };
  },
  
  click: imageHash => {
    var params = {
      imageHash,
    };
    return dispatch => {
      return fetch(API.ADVERTISING_CLICK, API.POST_CONFIG(params))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(json => {
          return 'ok';
        })
        .catch(error => {
          if (error.response) {
            return dispatch(ErrorActions.setError(error.response));
          } else {
            console.log(error);
            
            return 'An error occured!';
          }
        });
    };
  },

  reach: imageHash => {
    var params = {
      imageHash,
    };
    return dispatch => {
      return fetch(API.ADVERTISING_REACH, API.POST_CONFIG(params))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(json => {
          return 'ok';
        })
        .catch(error => {
          if (error.response) {
            return dispatch(ErrorActions.setError(error.response));
          } else {
            console.log(error);
            
            return 'An error occured!';
          }
        });
    };
  },

  stats: (conversion, year, month) => {
    return dispatch => {
      return fetch(API.ADVERTISING + `/stats/${year}/${month}`, API.GET_CONFIG)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(json => {
          // In json, we have cost, clicks, reach. Dispatch them to the redux store
          return dispatch({
            ...json,
            type: AdvertisingConstants.GET_STATS,
            cost: (parseInt(json.cost, 10) * conversion).toFixed(2),
          });
        })
        .catch(error => {
          if (error.response) {
            return dispatch(ErrorActions.setError(error.response));
          } else {
            console.log(error);
            
            return 'An error occured!';
          }
        });
    };
  },
};
*/
export default actions;
