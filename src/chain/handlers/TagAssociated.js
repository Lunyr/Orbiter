/**
 * This is the event handler for Tagger.TagAssociated
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  associateTag,
} from '../../backend/api';

const log = logger.getLogger('TagAssociated');

export default async (job) => {
  log.debug({ job: job }, "TagAssociated handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'TagAssociated')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  const tagResult = await getTag(evData.tagName);

  if (!tagResult.success || tagResult.data.length < 1) {
    throw new Error("Unknown tag!  Events out of order?");
  }

  job.progress(50);

  // Briefly this event had an argument with the underscore
  const assocResult = await associateTag(tagResult.data[0].id, evData.editStreamId || evData._editStreamId);

  if (!assocResult.success || assocResult.data.length < 1) {
    throw new Error(assocResult.error);
  }

  job.progress(80);

  await utils.completeTransaction(txHash, TxType.TAG);

  job.progress(100);

};