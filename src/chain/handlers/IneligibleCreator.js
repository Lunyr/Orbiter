/**
 * This is the event handler for PeerReview.IneligibleCreator
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
} from '../../backend/api';

const EVENT_NAME = 'IneligibleCreator';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    await addNotification(evData.creator, EVENT_NAME, {
      proposalId: null,
      event: EVENT_NAME,
      message: "Permission denied to create a proposal.",
    });
  });
};