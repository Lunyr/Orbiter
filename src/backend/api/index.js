export { default as testAPI } from './test';
export { addTx, getAddressByTx } from './transaction';
export { getWatch, addWatch, setWatchState } from './watch';
export { addEvent } from './event';
export { addNotification, getNotifications, markRead } from './notification';
export { getEditStream, addEditStream, updateEditStream } from './editstream';
export { getProposal, addProposal, rejectProposal, acceptProposal, expireProposal } from './proposal';
export { getVote, addVote } from './vote';
export { getTag, addTag, activateTag, addTagProposal, associateTag } from './tag';
