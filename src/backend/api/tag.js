import { db } from '../db';

export const getTag = async (tagName) => {
  try {
    const data = await db('tag').where({
      name: tagName
    }).select();
    log.debug({ data }, "getTag result");
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
    const data = await db('tag').orderBy('name').offset(offset).limit(limit).select();
    log.debug({ data }, "getTags result");
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
      name: tagName
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
    const data = await db().raw(
      `SELECT tag_id, edit_stream_id
         FROM tag t
         JOIN tag_edit_stream tes USING (tag_id)
         WHERE t.name = ? AND tes.edit_stream_id = ?`,
      [tagName, editStreamId]
    );
    log.debug({ data }, "getTagAssociation result");
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
