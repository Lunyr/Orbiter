import { db } from '../db';

export const getTag = async (tagName) => {
  try {
    const data = await db('tag').where({
      name: tagName
    }).select();
    console.log("getTag result", data);
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
    console.log("addTag result", data);
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
    console.log("addTagProposal result", data);
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
    console.log("getTagAssociation result", data);
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
    console.log("addTagEditStream result", data);
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
    console.log("activateTag result", data);
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
