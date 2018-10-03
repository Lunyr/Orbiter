import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import first from 'lodash/first';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import { ModalActions } from '../../redux/modals';
import { NotificationActions } from '../../redux/notification';
import { TaggingActions } from '../../redux/tagging';
import theme from '../../theme';

// Components
import AtoZSection from '../AtoZSection';
import TagsView from '../TagsView';
import Button from '../components/base/buttons/BaseButton';
import ApproveTagModal from '../modals/ApproveTagModal';
import ProposeTagModal from '../modals/ProposeTagModal';
import GasModal from '../modals/GasModal/index';

class Tagging extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      approvedTag: undefined,
      approveModal: false,
      proposedTag: '',
      tagRestrictions: undefined,
      usersHP: 0,
    };
  }

  onApproveTag = approvedTag => {
    if (approvedTag) {
      this.setState({ approvedTag, approveModal: true }, () => {
        this.props.onOpenApproveTagModal(true);
      });
    }
  };

  onProposeTag = () => {
    this.setState({ approveModal: false }, () => {
      this.props.onOpenProposeTagModal(true);
    });
  };

  onProposeTagChange = proposedTag => {
    this.setState({ proposedTag });
  };

  getUserTransactionNonce = async userAddress => {
    // Retrieve last transaction hash to verify the user can perform another transaction
    const { onGetLatestTransaction, web3 } = this.props;
    const lastTxHash = await onGetLatestTransaction(userAddress);
    if (lastTxHash) {
      const tx = web3.web3HTTP.eth.getTransaction(lastTxHash);
      const txCount = web3.web3HTTP.eth.getTransactionCount(userAddress, 'pending');
      if (txCount === 0) {
        return 0;
      } else if (tx) {
        return txCount > tx.nonce + 1 ? txCount : tx.nonce + 1;
      } else {
        return txCount;
      }
    } else {
      return web3.web3HTTP.eth.getTransactionCount(userAddress, 'pending');
    }
  };

  doesTagExist = async tag => {
    return this.props.tagContract.exists(tag);
  };

  addTransactionWatch = (transactionHash, userAddress, username, type, tag) => {
    const { notification, onWatchTransaction } = this.props;
    onWatchTransaction(
      transactionHash,
      userAddress,
      username,
      type,
      tag,
      '',
      notification.latestRawTx,
      notification.latestSignedTx
    );
  };

  handleApprovalTransaction = async gasPrice => {
    const { auth, tagContract } = this.props;
    const { approvedTag } = this.state;
    if (tagContract) {
      const username = auth.account.username;
      const userAddress = auth.account.profile.ethereumAddress;
      const nonce = await this.getUserTransactionNonce(userAddress);
      // Submit the proposal transaction via contract
      const transactionHash = await tagContract.propose.sendTransaction(approvedTag, {
        from: userAddress,
        gas: 1e6,
        gasPrice,
        nonce,
      });
      // Watch transaction
      this.addTransactionWatch(transactionHash, userAddress, username, 'approve-tag', approvedTag);
      return transactionHash;
    } else {
      throw new Error(
        "We're not connected to the blockchain. Please refresh your page and try again!"
      );
    }
  };

  handleProposalTransaction = async gasPrice => {
    const { auth, tagContract } = this.props;
    const { proposedTag } = this.state;
    if (tagContract) {
      const tagExists = await this.doesTagExist(proposedTag);
      if (tagExists) {
        this.setState({ error: 'Tag already exists, please try another.' });
        return;
      }
      const username = auth.account.username;
      const userAddress = auth.account.profile.ethereumAddress;
      const nonce = await this.getUserTransactionNonce(userAddress);
      // Submit the proposal transaction via contract
      const transactionHash = await tagContract.propose.sendTransaction(proposedTag, {
        from: userAddress,
        gas: 1e6,
        gasPrice,
        nonce,
      });
      // Watch transaction
      this.addTransactionWatch(transactionHash, userAddress, username, 'propose-tag', proposedTag);
      return transactionHash;
    } else {
      throw new Error(
        "We're not connected to the blockchain. Please refresh your page and try again!"
      );
    }
  };

  async componentDidMount() {
    const { auth, contributorsContract, environmentContract, onFetchTags } = this.props;
    onFetchTags(1000, 0);
    const userAddress = get(auth, ['account', 'profile', 'ethereumAddress']);
    if (userAddress) {
      const usersHP = await contributorsContract.getHNR(userAddress).then(hp => hp.toString());
      const parseIntWithRadix = n => parseInt(n, 10);
      const [proposeTagHNR, associateTagHNR, disassociateTagHNR] = await Promise.all([
        environmentContract.getValue('proposeTagHNR').then(parseIntWithRadix),
        environmentContract.getValue('associateTagHNR').then(parseIntWithRadix),
        environmentContract.getValue('disassociateTagHNR').then(parseIntWithRadix),
      ]);
      console.debug(
        'User Address',
        userAddress,
        'User HP',
        usersHP,
        'Restrictions',
        proposeTagHNR,
        associateTagHNR,
        disassociateTagHNR
      );
      this.setState({
        usersHP,
        tagRestrictions: {
          proposeTagHNR,
          associateTagHNR,
          disassociateTagHNR,
        },
      });
    }
  }

  render() {
    const { approveModal, approvedTag, proposedTag, tagRestrictions, usersHP } = this.state;
    const { fetching, onSelectTagGroup, selected, tags } = this.props;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.header)}>
          <div className={css(styles.header__left)}>
            <h1 className={css(styles.header__title)}>
              <FormattedMessage id="tagging_header" defaultMessage="Tagging" />
            </h1>
            <p className={css(styles.header__help)}>
              Article tagging provides a way for the community to attribute an articles content to a
              given context.
            </p>
          </div>
          {tagRestrictions &&
            usersHP >= tagRestrictions.proposeTagHNR && (
              <Button
                onClick={this.onProposeTag}
                styles={{ button: styles.button }}
                value="Propose New Tag"
              />
            )}
        </div>
        <div className={css(styles.content)}>
          <AtoZSection fetching={fetching} onClick={onSelectTagGroup} selected={selected} />
          <TagsView
            onApproval={
              tagRestrictions && usersHP >= tagRestrictions.proposeTagHNR && this.onApproveTag
            }
            selected={selected}
            tags={tags[selected]}
          />
        </div>
        <ApproveTagModal tag={approvedTag} />
        <ProposeTagModal onChange={this.onProposeTagChange} />
        <GasModal
          sendTransaction={
            approveModal ? this.handleApprovalTransaction : this.handleProposalTransaction
          }
          gasAmt={1e6}
          actionMessage={
            approveModal
              ? `approve a new tag proposal, "${approvedTag}"`
              : `propose a new tag, ${proposedTag}`
          }
          type="propose-tag"
        />
      </div>
    );
  }
}

const styles = StyleSheet.create({

});

const mapStateToProps = ({
  auth,
  contracts,
  modals: { openApproveTagModal },
  notification,
  tagging: { tags, ...tagging },
  web3,
}) => ({
  auth,
  contributorsContract: contracts.Contributors,
  environmentContract: contracts.Environment,
  notification,
  openApproveTagModal,
  ...tagging,
  tags: groupBy(tags, ({ name }) => first(name)),
  tagContract: contracts.Tagger,
  web3,
});

const mapDispatchToProps = {
  onFetchTags: TaggingActions.fetchTags,
  onSelectTagGroup: TaggingActions.selectTagGroup,
  onOpenApproveTagModal: ModalActions.openApproveTagModal,
  onOpenProposeTagModal: ModalActions.openProposeTagModal,
  onGetLatestTransaction: NotificationActions.getLatestTx,
  onWatchTransaction: NotificationActions.watchTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Tagging));
