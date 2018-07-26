/**
 * This is the event handler for Tagger.TagProposed
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  addTag,
  addTagProposal,
} from '../../backend/api';

const log = logger.getLogger('TagProposed');

export default async (job) => {
  log.debug("TagProposed handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'TagProposed')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  const tagCheck = await getTag(evData.tagName);

  job.progress(50);

  if (!tagCheck.success || tagCheck.data.length < 1) {
    tagCheck = await addTag(evData.tagName);
    if (!tagCheck.sucess) {
      throw new Error(tagCheck.error);
    }
  }

  job.progress(65);

  const tagPropResult = await addTagProposal(tagCheck.data[0].tag_id, evData.creator);
  if (!tagPropResult.success) {
    throw new Error(tagPropResult.error);
  }

  job.progress(80);

  // Add notification
  await addNotification(evData.creator, 'TagProposed', {
    proposer: evData.creator,
    tagName: evData.tagName,
  });

  job.progress(90);

  await utils.completeTransaction(txHash, TxType.TAG);

  job.progress(100);

};