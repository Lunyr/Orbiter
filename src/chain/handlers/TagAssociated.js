/**
 * This is the event handler for Tagger.TagAssociated
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  associateTag,
} from '../../backend/api';

const EVENT_NAME = 'TagAssociated';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
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
  });
};