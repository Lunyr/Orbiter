import { getProposalsInReview } from '../../../../../backend/api';
import createTriggerAlias from '../../../helpers/createTriggerAlias';

const actions = {
  FETCH: 'proposal/FETCH_IN_REVIEW',
};

export const fetchInReviewProposals = createTriggerAlias(actions.FETCH, (limit, offset) => ({
  type: actions.FETCH,
  // TODO: Add in metrics into the call
  payload: Promise.all([
    getProposalsInReview(limit, offset).then(({ data }) => {
      return {
        data,
      };
    }),
  ]),
}));

export default actions;
