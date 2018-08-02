import { db } from '../db';
import { getLogger } from '../../lib/logger';
import { toTag, fromTag } from '../assemblers';

const log = getLogger('api-tag');

export const getTag = async (tagName) => {
  try {
    const result = await db('tag').where({
      name: tagName
    }).select();

    log.debug({ result }, "getTag result");

    const data = result.map(t => toTag(t));

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

export const getTags = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const result = await db('tag').orderBy('name').offset(offset).limit(limit).select();

    log.debug({ result }, "getTags result");

    const data = result.map(t => toTag(t));

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

export const getActiveTags = async (limit, page) => {
  try {
    limit = limit ? limit : 25;
    page = page ? page : 0;
    const offset = page * limit;
    const result = await db('tag')
      .where({ active: true })
      .orderBy('name')
      .offset(offset)
      .limit(limit)
      .select();

    log.debug({ result }, "getActiveTags result");

    const data = result.map(t => toTag(t));

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

export const addTag = async (tagName) => {
  try {
    const data = await db('tag').insert({
      name: tagName,
      active: false
    });
    log.debug({ data }, "addTag result");
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

export const getTagProposals = async (tagId) => {
  try {
    const result = await db('tag_proposal').where({
      tag_id: tagId,
    }).select();

    log.debug({ result }, "getTagProposals result");

    const data = result.map(tp => {
      return {
        tagId: tp.tag_id,
        fromAddress: tp.from_address,
      };
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

export const addTagProposal = async (tagId, fromAddress) => {
  try {
    const data = await db('tag_proposal').insert({
      tag_id: tagId,
      from_address: fromAddress,
    });
    log.debug({ data }, "addTagProposal result");
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

export const getTagAssociation = async (tagName, editStreamId) => {
  try {
    const result = await db.raw(
      `SELECT tag_id, edit_stream_id
         FROM tag t
         JOIN tag_edit_stream tes USING (tag_id)
         WHERE t.name = ? AND tes.edit_stream_id = ?`,
      [tagName, editStreamId]
    );

    log.debug({ result }, "getTagAssociation result");

    const data = result.map(tp => {
      return {
        tagId: tp.tag_id,
        editStreamId: tp.edit_stream_id,
      };
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

export const associateTag = async (tagId, editStreamId) => {
  try {
    const data = await db('tag_edit_stream').insert({
      tag_id: tagId,
      edit_stream_id: editStreamId,
    });
    log.debug({ data }, "addTagEditStream result");
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

export const activateTag = async (tagName) => {
  try {
    const data = await db('tag').where({
      name: tagName,
    }).update({
      active: true
    });
    log.debug({ data }, "activateTag result");
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
