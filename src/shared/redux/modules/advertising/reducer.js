import actions from './actions';

const initialState = {
  url: '',
  title: '',
  body: '',
  imageHash: '',
  actionLabel: '',
  startsOn: '',
  endsOn: '',
  bidValueLUN: 0,
  bidValueDollars: 0,
  cost: '-',
  reach: '-',
  clicks: '-',
  ads: [],
};

const advertisingReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.FETCH:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default advertisingReducer;
