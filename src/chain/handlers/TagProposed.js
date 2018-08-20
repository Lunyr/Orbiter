/**
 * This is the event handler for Tagger.TagProposed
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  addTag,
  addTagProposal,
} from '../../backend/api';

const EVENT_NAME = 'TagProposed';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);

    let tagCheck = await getTag(evData.tagName);

    job.progress(50);

    if (!tagCheck.success || tagCheck.data.length < 1) {
      tagCheck = await addTag(evData.tagName);
      if (!tagCheck.sucess) {
        throw new Error(tagCheck.error || "Unknown error");
      }
    }

    job.progress(65);

    const tagPropResult = await addTagProposal(tagCheck.data[0].tag_id, evData.creator);
    if (!tagPropResult.success) {
      throw new Error(tagPropResult.error);
    }

    job.progress(80);

    // Add notification
    await addNotification(evData.creator, EVENT_NAME, {
      proposer: evData.creator,
      tagName: evData.tagName,
    });

    job.progress(90);
  });
};