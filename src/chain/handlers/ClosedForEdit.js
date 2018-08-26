/**
 * This is the event handler for PeerReview.ClosedForEdit
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const EVENT_NAME = 'ClosedForEdit';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    await addNotification(evData.editor, EVENT_NAME, {
      proposalId: evData.proposalId,
      event: EVENT_NAME,
      message: "This proposal is closed for editing.",
    });
  });
};