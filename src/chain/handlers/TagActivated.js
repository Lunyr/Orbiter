/**
 * This is the event handler for Tagger.TagActivated
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  activateTag,
} from '../../backend/api';

const EVENT_NAME = 'TagActivated';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);

    const tagResult = await getTag(evData.tagName);

    if (!tagResult.success || !tagResult.data) {
      throw new Error("Unknown tag!  Events out of order?");
    }

    job.progress(50);

    await activateTag(evData.tagName);

    job.progress(80);
  });
};