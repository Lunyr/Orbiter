export { addTx, getAddressByTx } from './transaction';
export { getWatch, getPendingWatch, addWatch, setWatchState } from './watch';
export { addEvent } from './event';
export { addNotification, getNotifications, markRead, getUnread } from './notification';
export { getEditStream, addEditStream, updateEditStream } from './editstream';
export {
  getProposal,
  getDirtyProposals,
  addProposal,
  updateProposal,
  rejectProposal,
  acceptProposal,
  expireProposal,
  getProposalsWrittenBy,
  getProposalsInReviewBy,
  getProposalsInReview,
} from './proposal';
export {
  getArticles,
  getCurrentArticle,
  getCurrentArticleByTitle,
  getContributors,
} from './article';
export {
  getVote,
  getDirtyVotes,
  updateVote,
  addVote,
  getProposalVoteStats,
  getProposalVotes,
  userVotedOnProposal,
  getUsersRecentVotes,
} from './vote';
export {
  getTag,
  getTags,
  getActiveTags,
  addTag,
  activateTag,
  getTagProposals,
  addTagProposal,
  associateTag,
  getTagAssociation,
} from './tag';
export { getDraft, getDraftByProposalId, setDraftToDraft, addDraft, editDraft } from './draft';
export { getFeed, getFeedArticlesAccepted, getFeedArticlesInReview, getFeedVotes } from './feed';
export { getDiscover } from './discover';
export { getUserSettings, setUserSetting } from './setting';
export { searchArticles } from './search';
export { authenticate } from './auth';
export { default as Web3API } from './web3';
