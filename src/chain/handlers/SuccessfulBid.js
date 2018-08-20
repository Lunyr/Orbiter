/**
 * This is the event handler for Auctioneer.SuccessfulBid
 */
import { getLogger } from '../../lib/logger';
import { handlerWrapper } from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getAddressByTx,
} from '../../backend/api';

const EVENT_NAME = 'SuccessfulBid';
const log = getLogger(EVENT_NAME);

export default async (job, txHash, evData) => {
  return handlerWrapper(EVENT_NAME, txHash, job, log, async () => {
    job.progress(10);

    log.debug({ txHash }, "Looking up user address ");

    // We can only look up a user address by a transaction entry in this case
    const userAddr = await getAddressByTx(txHash);

    if (userAddr.success && userAddr.data !== null) {
      await addNotification(userAddr.data, EVENT_NAME, {
        bidder: userAddr.data,
        scope: evData.scope,
        timePeriod: evData.timePeriod,
        lunAmount: evData.lunAmount,
      });
    }
    job.progress(90);
  });
};