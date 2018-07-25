/**
 * This is the event handler for Auctioneer.SuccessfulBid
 */
import logger from '../../lib/logger';
import utils from '../utils';
import { TxType } from '../../shared/constants';
import { 
  addNotification,
  getAddressByTx,
} from '../../backend/api';

const log = logger.getLogger('SuccessfulBid');

export default async (job) => {
  log.debug("SuccessfulBid handler reached");

  job.progress(1);

  // Sanity check
  if (job.data.event.name !== 'SuccessfulBid')
    throw new Error('Invalid event for this handler');

  const evData = utils.getEventData(job.data.event);
  const txHash = job.data.txHash;

  job.progress(10);

  log.debug({ txHash }, "Looking up user address ");

  // We can only look up a user address by a transaction entry in this case
  const userAddr = await getAddressByTx(txHash);

  if (userAddr.success && userAddr.data !== null) {
    await addNotification(userAddr.data, 'SuccessfulBid', {
      bidder: userAddr.data,
      scope: evData.scope,
      timePeriod: evData.timePeriod,
      lunAmount: evData.lunAmount,
    });
  }

  job.progress(50);

  await utils.completeTransaction(txHash, TxType.BID);

  job.progress(100);

};