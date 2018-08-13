import { db } from '../db';
import { getLogger } from '../../lib/logger';
import { toArticle } from '../assemblers';
import { ProposalState } from '../../shared/constants';

const log = getLogger('api-search');

export const searchArticles = async (term) => {
  try {
    const searchTerm = `%${term}%`;
    const result = await db.raw(
      `SELECT p.*
        FROM proposal p
        JOIN (
          SELECT DISTINCT(p2.edit_stream_id)
          FROM proposal p2
          WHERE proposal_state_id = ?
          AND (
            p2.title LIKE ?
            OR p2.megadraft LIKE ?
            OR p2.description LIKE ?
          )) AS es ON es.edit_stream_id = p.edit_stream_id
        WHERE p.proposal_id = (
          SELECT MAX(p3.proposal_id)
          FROM proposal p3
          WHERE p3.edit_stream_id = es.edit_stream_id
          AND p3.proposal_state_id = ?);`,
      [
        ProposalState.ACCEPTED,
        searchTerm,
        searchTerm,
        searchTerm,
        ProposalState.ACCEPTED
      ]
    );

    log.debug({ result }, "searchArticles result");

    const data = result.map(a => toArticle(a));

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