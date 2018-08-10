/**
 * This is the event handler for PeerReview.IneligibleEditor
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { 
  addNotification,
} from '../../backend/api';

const EVENT_NAME = 'IneligibleEditor';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return await handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    await addNotification(evData.editor, EVENT_NAME, {
      proposalId: evData.proposalId,
      event: EVENT_NAME,
      message: "Permission denied to edit this proposal.",
    });
  });
};