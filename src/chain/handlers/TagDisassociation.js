/**
 * This is the event handler for Tagger.TagDisassociated
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  associateTag,
} from '../../backend/api';

const log = logger.getLogger('TagDisassociated');

export default async (job) => {
  log.debug("TagDisassociated handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'TagDisassociated')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  const editStreamId = evData.editStreamId || evData._editStreamId;

  const tagAssocResult = await getTagAssociation(evData.tagName, editStreamId);

  if (!tagAssocResult.success) {
    throw new Error(tagAssocResult.error);
  } else if (tagAssocResult.data.length < 1) {
    throw new Error("Unknown tag association!  Events out of order?");
  }

  job.progress(50);

  const deleteResult = await deleteTagAssociation(tagAssocResult.data[0].tag_id, editStreamId);

  if (!deleteResult.success || deleteResult.data.length < 1) {
    throw new Error(deleteResult.error);
  }

  job.progress(80);

  await utils.completeTransaction(txHash, TxType.TAG);

  job.progress(100);

};