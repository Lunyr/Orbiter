import { db } from '../db';
import { ProposalState } from '../../shared/constants';
import { getLogger } from '../../lib/logger';

const log = getLogger('api-article');

export const getArticles = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const data = await db('edit_stream').innerJoin(
      'proposal',
      'proposal.edit_stream_id',
      'edit_stream.edit_stream_id'
    ).where({
      proposal_state_id: ProposalState.ACCEPTED
    }).offset(offset).limit(limit).select();
    log.debug({ data }, "getArticles result");
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