/**
 * This is the event handler for Tagger.TagProposalFailed
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { 
  addNotification
} from '../../backend/api';

const EVENT_NAME = 'TagProposalFailed';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);
    
    await addNotification(evData.withdrawer, EVENT_NAME, {
      creator: evData.creator,
      tagName: evData.tagName,
    });

    job.progress(50);
  });
};