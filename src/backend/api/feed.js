import { db } from '../db';
import { ProposalState, TxState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';
import { toFeedVote, toFeedProposal } from '../assemblers';

const log = getLogger('api-feed');

export const getFeedVotes = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const result = await db('vote')
      .orderBy('created', 'DESC')
      .limit(limit)
      .offset(offset)
      .select();

    log.debug({ result }, "getFeedVotes result");

    const data = result.map(p => toFeedVote(p));
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getFeedArticlesInReview = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const result = await db('proposal')
      .where({
        proposal_state_id: ProposalState.IN_REVIEW,
      })
      .orderBy('created', 'DESC')
      .limit(limit)
      .offset(offset)
      .select(['*', db.raw(`? AS type`, ['review'])]);

    log.debug({ result }, "getFeedArticlesInReview result");

    const data = result.map(p => toFeedProposal(p));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getFeedArticlesAccepted = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const result = await db('proposal')
      .where({
        proposal_state_id: ProposalState.ACCEPTED,
      })
      .orderBy('created', 'DESC')
      .limit(limit)
      .offset(offset)
      .select(['*', db.raw(`? AS type`, ['article'])]);

    log.debug({ result }, "getFeedArticlesAccepted result");

    const data = result.map(p => toFeedProposal(p));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getFeed = async (limit, page) => {
  try {
    const divLimit = Math.floor(limit / 3);

    const votes = await getFeedVotes(divLimit, page);
    const inReview = await getFeedArticlesInReview(divLimit, page);
    const accepted = await getFeedArticlesAccepted(divLimit, page);

    const data = [
        ...votes.data,
        ...inReview.data,
        ...accepted.data
      ].sort((a,b) => {
        return a.created - b.created;
      });

    log.debug({ data }, "getFeed results");

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};