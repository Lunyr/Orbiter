/***
 * sweeper - Handles cleanup of failed transactions
 * @mikeshultz - mike@lunyr.com
 * TODO: Refactor to use utility functions of this module
 */
import fetch from 'node-fetch';
import { getLogger } from '../lib/logger';
import { settings } from '../shared/settings';
import { handleError } from '../shared/handlers';
import { TxState, DraftState, ProposalState } from '../shared/constants';
import {
  addNotification,
  getPendingWatch,
  getWatch,
  setWatchState,
  getDraftByProposalId,
  setDraftToDraft,
} from '../backend/api';

const log = getLogger('sweeper');

/**
 * Sweeper is a pending transaction processor that handles things like setting
 * a transaction as failed.  It's complementary to the eventhandler in that
 * there are some things that can not be event-generated
 */
export class Sweeper {
  /**
   * Init the process
   */
  constructor(start = true) {
    if (start) this.start();
    this.exit = false;
  }

  /**
   * start() runs the process
   */
  start() {
    return new Promise((resolve, reject) => {
      log.info('Starting transaction cleanup process');

      let that = this;

      // Check for transactions ever 15 seconds(approximate block time)
      setInterval(async () => {
        log.debug('Looking for transactions...');
        // Retrieve transactions from the DB
        let txs = await that.getPendingTransactions();
        if (txs) {
          log.debug({ txs: txs }, 'Received transactions');
          // Process them
          try {
            await that.processTransactions(txs);
          } catch (err) {
            log.error(err);
            handleError(err);
          }
        } else {
          log.debug('No pending transactions found.');
        }
      }, 15000);
    });
  }

  /**
   * getPendingTransactions returns all currently pending transactions from
   * the DB.
   * @return {array} The pending transactions
   */
  async getPendingTransactions() {
    log.debug('Fetching pending transactions from database...');
    const results = await getPendingWatch();
    if (results && results.data && results.data.length > 0) {
      return results.data;
    } else {
      return [];
    }
  }

  /**
   * processTransactions goes through every pending transaction and sets them as
   * failed if necessary.
   * @param {array} The array of transactions
   */
  async processTransactions(txs) {
    if (!txs) throw new Error('No transactions provided to processTransactions');

    log.debug(`Processing ${txs.length} transactions looking for failures...`);

    for (let i = 0; i < txs.length; i++) {
      let txState = await this.checkTransaction(txs[i]);

      if (
        (txState === TxState.FAILURE || txState === TxState.DROPPED) &&
        txs[i].type === 'publish'
      ) {
        log.info({ proposal_id: txs[i].proposalId }, 'Reverting draft');

        const draft = await getDraftByProposalId(txs[i].proposalId, DraftState.SUBMITTED);
        if (draft.success && draft.data.length > 0) {
          const draftUpdateResult = await setDraftToDraft(draft.data[0].id);
          if (!draftUpdateResult.success) {
            throw new Error(draftUpdateResult.error);
          }
        }
      }

      if (txState === TxState.FAILURE) {
        log.info({ txHash: txs[i].hash }, 'Found failed transaction.');

        // Set failed in DB
        await this.setTransactionState(txs[i], txState);

        // Notify user
        await addNotification(txs[i].from_address, 'TxFailed', {
          txHash: txs[i].id,
          state: txState,
          type: txs[i].type,
        });
      } else if (txState === TxState.DROPPED) {
        log.info({ txHash: txs[i].id }, 'Found dropped transaction.');

        // Set failed in DB
        await this.setTransactionState(txs[i], txState);

        // Notify user
        await addNotification(txs[i].fromAddress, 'TxDropped', {
          txHash: txs[i].id,
          state: txState,
          type: txs[i].type,
        });
      } else if (txState === TxState.SUCCESS) {
        // Set success in DB
        await this.setTransactionState(txs[i], txState);

        // Notify user
        await addNotification(txs[i].fromAddress, 'TxAccepted', {
          txHash: txs[i].id,
          state: txState,
          type: txs[i].type,
        });
      } else {
        log.debug({ txState: txState }, 'Transaction not failed.');
      }
    }
  }

  /**
   * getTransaction makes a JSON-RPC call for eth_getTransaction.
   * Callbacks suck, so bypassing web3
   * @return {object} Transaction object
   */
  async getTransaction(txHash) {
    // eth_getTransaction JSON-RPC call
    const eth_getTransaction = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionByHash',
        params: [txHash],
      }),
    };

    // Set destination network endpoint
    let endpoint;
    if (process.env.APP_ENV === 'production') {
      endpoint = settings.jsonRPC.mainnet;
    } else {
      endpoint = settings.jsonRPC.lunyr_testnet;
    }

    // Do it
    let result = await fetch(endpoint, eth_getTransaction).catch((err) => {
      log.error({ error: err }, 'error fetching from JSON-RPC');
    });

    // if nothing, return null the same as eth_getTransaction
    if (!result) {
      return null;
    }

    // Process JSON
    let json = await result.json();

    log.debug({ result: json }, 'request to JSON-RPC complete.');

    return json.result;
  }

  /**
   * getTransactionReceipt makes a JSON-RPC call for eth_getTransactionReceipt.
   * Callbacks suck, so bypassing web3
   * @return {object} Transaction receipt object
   */
  async getTransactionReceipt(txHash) {
    // eth_getTransactionReceipt JSON-RPC call
    const eth_getTransactionReceipt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      }),
    };

    // Set destination network endpoint
    let endpoint;
    if (process.env.APP_ENV === 'production') {
      endpoint = settings.jsonRPC.mainnet;
    } else {
      endpoint = settings.jsonRPC.lunyr_testnet;
    }

    // Do it
    let result = await fetch(endpoint, eth_getTransactionReceipt).catch((err) => {
      log.error({ error: err }, 'error fetching from JSON-RPC');
    });

    // if nothing, return null the same as eth_getTransactionReceipt
    if (!result) {
      return null;
    }

    // Process JSON
    let json = await result.json();

    log.debug({ result: json }, 'request to JSON-RPC complete.');

    return json.result;
  }

  /**
   * checkTransaction tries to figure out if a transaction is pending or
   * failed
   * @param {object} A transaction
   * @return {object} The state of the transaction(see: TxState)
   */
  async checkTransaction(tx) {
    log.debug({ txHash: tx.hash }, 'Requesting transaction receipt.');

    // Get the receipt
    let receipt = await this.getTransactionReceipt(tx.id);

    if (receipt) {
      /**
       * The status field should be available for post-Byzantium blocks, but
       * we will need to fallback to checking for logs like used in the old
       * golang implementation.  So we need to check where we are in the
       * chain.
       */
      log.debug({ blockNumber: receipt.blockNumber }, 'Got transaction receipt');
      const isByzantium = receipt.blockNumber >= 4370000;

      if (isByzantium) {
        if (receipt.status === 0 || receipt.status === '0x0') {
          log.info({ txHash: tx.id }, 'Transaction failed');
          return TxState.FAILURE;
        } else {
          return TxState.SUCCESS;
        }
      } else {
        /**
         * Check for logs and see if gasUsed hit the gas limit.  1e6 is the gas
         * limit hard-coded during the alpha.
         */
        if (receipt.logs.length > 0 && receipt.gasUsed < 1e6) {
          return TxState.SUCCESS;
        } else {
          log.info({ txHash: tx.id }, 'Transaction failed');
          return TxState.FAILURE;
        }
      }
    } else {
      /**
       * If we can't get a receipt, it might be pending.  If it's old, check
       * for the transaction on the node first and if we can't find it after
       * a while, assume it's gone from the txpool
       *
       * This logic is a little iffy and may require changes in the future
       * depending on how Infura decides to deal with it.  See:
       * https://blog.infura.io/when-there-are-too-many-pending-transactions-8ec1a88bc87e
       *
       * TODO: review this logic
       */
      let pendingTx = await this.getTransaction(tx.id);
      if (!pendingTx) {
        const cutoff = Date.parse(tx.createdAt) + settings.sweeper.maxTransactionAge;
        if (cutoff < new Date()) {
          log.info({ txHash: tx.id }, 'Transaction dropped');
          return TxState.DROPPED;
        } else {
          return TxState.PENDING;
        }
      }
    }
  }

  /**
   * setTransactionState will set a transaction as failed in the database
   * @param {object} A transaction
   */
  async setTransactionState(tx, state) {
    log.debug({ txHash: tx.id }, 'Setting transaction state in database.');
    // Set state in DB
    const watchCheck = await getWatch(tx.id);
    if (watchCheck.success && watchCheck.data.length > 0) {
      const updateResult = await setWatchState(tx.id, state);
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }
    }
  }
}

export default async () => {
  // Begin process
  const janitor = new Sweeper(false);
  return janitor.start();
};
