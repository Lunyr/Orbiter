import { clearUndefined } from './utils';

/**
 * toTxStatus takes a watch object(or returned bookshelf Collection) and 
 * assembles a "tx-status" that can be displayed to the user.
 * @param {object} - The watch to convert
 * @return {object} - The newly assembled raw tx-status object
 */
export const toTxStatus = (watch) => {
  // In case we're given a bookshelf Collection
  return {
    id: watch.hash,
    txHash: watch.hash,
    state: watch.transaction_state_id,
    type: watch.type,
    fromAddress: watch.from_address,
    articleTitle: watch.title,
    read: watch.read,
    tx: watch.tx,
    signedtx: watch.signedtx,
    createdAt: watch.created,
    updatedAt: watch.updated,
    proposalId: watch.proposal_id,
    reimbursed: watch.reimbursement_state,
  };
};

/**
 * fromTxStatus takes a watch object from the frontend and assembles it into
 * something the DB can understand
 * @param {object} - The watch to convert
 * @return {object} - The newly assembled raw tx-status object
 */
export const fromTxStatus = (watch, isPartial = true) => {
  // In case we're given a bookshelf Collection
  let result = {
    hash: watch.txHash,
    transaction_state_id: watch.state,
    read: watch.read,
    proposal_id: watch.proposalId,
    from_address: watch.fromAddress,
    created: watch.createdAt,
    updated: watch.updatedAt,
    type: watch.type,
    title: watch.articleTitle,
    tx: watch.tx,
    signedtx: watch.signedtx,
  };
  if (isPartial) result = clearUndefined(result);
  return result;
};

/**
 * toNotification takes a notification object(or returned bookshelf Collection) and 
 * assembles a notification that can be displayed to the user.
 * @param {object} - The notification to convert
 * @return {object} - The newly assembled raw notification object
 */
export const toNotification = (notification) => {
  // In case we're given a bookshelf Collection
  return {
    id: notification.notification_id,
    hashedAddress: notification.hashed_address,
    createdAt: notification.created,
    updatedAt: notification.updated,
    read: notification.read,
    type: notification.type,
    data: notification.data,
  };
}

/**
 * toNotification takes a notification object(or returned bookshelf Collection) and 
 * assembles a notification that can be displayed to the user.
 * @param {object} - The notification to convert
 * @return {object} - The newly assembled raw notification object
 */
export const fromNotification = (notificationObj, isPartial = false) => {
  // In case we're given a bookshelf Collection
  let result = {
    notification_id: notificationObj.id,
    hashed_address: notificationObj.hashedAddress,
    created: notificationObj.createdAt,
    updated: notificationObj.updatedAt,
    read: notificationObj.read,
    type: notificationObj.type,
    data: notificationObj.data,
  };
  if (isPartial) result = clearUndefined(result);
  return result;
}
