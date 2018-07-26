export const TxState = Object.freeze({
  PENDING: 0,
  SUCCESS: 1,
  FAILURE: 2,
  DROPPED: 3
});

export const TxType = Object.freeze({
  OTHER: 'other',
  VOTE: 'vote',
  PUBLISH: 'publish',
  ETH: 'transferEth',
  LUN: 'transferLUN',
  BID: 'bid',
  TAG: 'tag',
});

export const TxTypeTranslation = Object.freeze({
  'ProposalSubmitted': TxType.PUBLISH,
  'IneligibleCreator': TxType.PUBLISH,
  'SuccessfulBid': TxType.BID,
  'SuccessfulBidRange': TxType.BID,
  'NotBiddable': TxType.BID,
  'NotBiddableRange': TxType.BID,
  'VoteOccurred': TxType.VOTE,
  'IneligibleVoter': TxType.VOTE,
  'ClosedForVote': TxType.VOTE,
});

export const ProposalState = Object.freeze({
  DRAFT: 0,
  IN_REVIEW: 1,
  REJECTED: 2,
  ACCEPTED: 3,
  EXPIRED: 4,
  PROPOSED: 5,
});

export const DraftState = Object.freeze({
  DRAFT: 0,
  SUBMITTED: 1,
});