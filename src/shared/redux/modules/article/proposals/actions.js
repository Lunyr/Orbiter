import { getProposalsInReview, getProposalsStats } from '../../../../../backend/api';
import createTriggerAlias from '../../../helpers/createTriggerAlias';

const actions = {
  FETCH: 'proposal/FETCH_IN_REVIEW',
};

export const fetchInReviewProposals = createTriggerAlias(
  actions.FETCH,
  (address, limit, offset) => ({
    type: actions.FETCH,
    payload: Promise.all([getProposalsInReview(limit, offset), getProposalsStats(address)]).then(
      (response) => {
        const [inReview, stats] = response;
        return {
          data: inReview.data,
          stats: stats.data,
        };
      }
    ),
  })
);

export default actions;
