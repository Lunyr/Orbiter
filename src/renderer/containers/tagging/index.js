import React from 'react';
import injectStyles from 'react-jss';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import first from 'lodash/first';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import { fetchTags, selectTagGroup } from '../../../shared/redux/modules/tagging/actions';
import styles from './styles';
import { Button } from '../../components';
import AtoZSection from './AtoZSection';
import TagsView from './TagsView';

/*
import { ModalActions } from '../../redux/modals';
import { NotificationActions } from '../../redux/notification';
import { TaggingActions } from '../../redux/tagging';
*/

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

  /*
  onApproveTag = (approvedTag) => {
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

  onProposeTagChange = (proposedTag) => {
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
  */

  async componentDidMount() {
    const { account, fetchTags } = this.props;

    fetchTags(1000, 0);
    /*
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
    */
  }
  
  handleTagGroupSelection = letter => {
    this.props.selectTagGroup(letter);
  };
  
  render() {
    const { approveModal, approvedTag, proposedTag, tagRestrictions, usersHP } = this.state;
    const { classes, fetching, selected, tags } = this.props;
    console.log('this.props', this.props);
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes.header__left}>
            <h1 className={classes.header__title}>
              <FormattedMessage id="tagging_header" defaultMessage="Tagging" />
            </h1>
            <p className={classes.header__help}>
              Article tagging provides a way for the community to attribute an articles content to a
              given context.
            </p>
          </div>
          {tagRestrictions &&
            usersHP >= tagRestrictions.proposeTagHNR && (
              <Button onClick={this.onProposeTag} value="Propose New Tag" />
            )}
        </div>
        <div className={classes.content}>
          <AtoZSection fetching={fetching} onClick={this.handleTagGroupSelection} selected={selected} />
          <TagsView
            onApproval={
              tagRestrictions && usersHP >= tagRestrictions.proposeTagHNR && this.onApproveTag
            }
            selected={selected}
            tags={tags[selected]}
          />
        </div>
        {/*
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
           */}
      </div>
    );
  }
}

const mapStateToProps = ({ auth: { account }, tagging: { tags, ...tagging } }) => ({
  account,
  ...tagging,
  tags: groupBy(tags, ({ name }) => first(name)),
});

const mapDispatchToProps = {
  fetchTags,
  selectTagGroup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Tagging)));
