/**
 * This is the event handler for Tagger.TagDisassociated
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getTag,
  deleteTagAssociation,
} from '../../backend/api';

const EVENT_NAME = 'TagDisassociated';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);

    const editStreamId = evData.editStreamId || evData._editStreamId;

    const tagAssocResult = await getTagAssociation(evData.tagName, editStreamId);

    if (!tagAssocResult.success) {
      throw new Error(tagAssocResult.error);
    } else if (!tagAssocResult.data) {
      throw new Error("Unknown tag association!  Events out of order?");
    }

    job.progress(50);

    const deleteResult = await deleteTagAssociation(tagAssocResult.data[0].id, editStreamId);

    if (!deleteResult.success || deleteResult.data.length < 1) {
      throw new Error(deleteResult.error);
    }

    job.progress(80);
  });
};