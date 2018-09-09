import createTriggerAlias from '../../helpers/createTriggerAlias';
import { Web3API } from '../../../../backend/api';

const actions = {
  SEND_TRANSACTION: 'chain/SEND_TRANSACTION',
};

export const publishProposal = createTriggerAlias(
  actions.SEND_TRANSACTION,
  (responseId, hash, transactionObject, privKey) => ({
    type: actions.SEND_TRANSACTION,
    meta: { responseId },
    payload: Web3API.publishProposal(hash, transactionObject, privKey),
  })
);

export const voteOnProposal = createTriggerAlias(
  actions.SEND_TRANSACTION,
  (responseId, voteParams, transactionObject, privKey) => ({
    type: actions.SEND_TRANSACTION,
    meta: { responseId },
    payload: Web3API.voteOnProposal(voteParams, transactionObject, privKey),
  })
);

export default actions;
