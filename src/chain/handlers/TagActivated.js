/**
 * This is the event handler for Tagger.TagActivated
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  activateTag,
} from '../../backend/api';

const log = logger.getLogger('TagActivated');

export default async (job) => {
  log.debug("TagActivated handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'TagActivated')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  const tagResult = await getTag(evData.tagName);

  if (!tagResult.success || tagResult.data.length < 1) {
    throw new Error("Unknown tag!  Events out of order?");
  }

  job.progress(50);

  await activateTag(evData.tagName);

  job.progress(80);

  await utils.completeTransaction(txHash, TxType.TAG);

  job.progress(100);

};