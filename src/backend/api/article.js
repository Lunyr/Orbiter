import { db } from '../db';
import { ProposalState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';
import { toArticle, toVote } from '../assemblers';

const log = getLogger('api-article');

export const getArticles = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;

    const result = await db('edit_stream').innerJoin(
      'proposal',
      'proposal.edit_stream_id',
      'edit_stream.edit_stream_id'
    ).where({
      proposal_state_id: ProposalState.ACCEPTED
    }).offset(offset).limit(limit).select();

    log.debug({ result }, "getArticles result");

    // Get IDs for the votes query
    const proposalIds = result.map(p => p.proposal_id);

    const votesResult = await db('vote')
      .where('proposal_id', 'IN', proposalIds)
      .orderBy('proposal_id')
      .orderBy('vote_id')
      .select();

    // repack and assemble for lookup by proposal_id
    let votesByProposal = {};
    votesResult.map(v => {
      if (!(votesByProposal[v.proposal_id] instanceof Array)) {
        votesByProposal[v.proposal_id] = [];
      }
      votesByProposal[v.proposal_id].push(toVote(v));
    });

    // Repack and assemble objects for frontend use
    const data = result.reduce((acc, a) => {
      if (!(acc instanceof Array)) acc = [acc];
      
      acc.push(toArticle(a));

      // Handle votes in the results
      if (votesByProposal[a.proposal_id] instanceof Array) {
        acc[acc.length-1].votes = votesByProposal[a.proposal_id];
      }

      return acc;
    });

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

export const getCurrentArticle = async (editStreamId) => {
  try {
    const data = await db('edit_stream').innerJoin(
      'proposal',
      'proposal.edit_stream_id',
      'edit_stream.edit_stream_id'
    ).where({
      'edit_stream.edit_stream_id': editStreamId
    }).orderBy('created', 'DESC').limit(1).select();
    log.debug({ data }, "getCurrentArticle result");
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

export const getCurrentArticleByTitle = async (title) => {
  try {
    const data = await db('edit_stream').innerJoin(
      'proposal',
      'proposal.edit_stream_id',
      'edit_stream.edit_stream_id'
    ).where({
      'edit_stream.title': title,
    }).orderBy('created', 'DESC').limit(1).select();
    log.debug({ data }, "getCurrentArticleByTitle result");
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

export const getContributors = async (editStreamId) => {
  try {
    const data = await db('edit_stream').innerJoin(
      'proposal',
      'proposal.edit_stream_id',
      'edit_stream.edit_stream_id'
    ).where({
      'edit_stream.edit_stream_id': editStreamId
    }).select('from_address');
    log.debug({ data }, "getContributors result");
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