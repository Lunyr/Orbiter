import React from 'react';
import injectStyles from 'react-jss';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ipfsAPI from 'ipfs-api';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import {
  clearDraftState,
  fetchDraft,
  saveDraft,
  setDraftParams,
  uploadFileToIPFS,
} from '../../../../../shared/redux/modules/article/draft/actions';
import { closeSidebar } from '../../../../../shared/redux/modules/app/actions';
import { readUploadedFileAsBuffer } from '../../../../../shared/utils';
import { Hero, LoadingIndicator, MegadraftEditor, TitleEditor } from '../../../../components';
import References from '../../references/References';
import styles from './styles';

const AddtionalContent = () => <div>Additional Content</div>;

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSavingDraft = debounce(this.handleSavingDraft, 150);
    this.ipfs = ipfsAPI('ipfs.infura.io', 5001, { protocol: 'https' });
    this.toastId = null;
  }

  saveToIpfs = (arrayBuffer) => {
    const buffer = Buffer.from(arrayBuffer);
    const totalUploadSize = arrayBuffer.byteLength;
    this.toastId = toast.info('Uploading content to ipfs...');
    const progressUpdate = (prog) => {
      toast.update(this.toastId, {
        render: `Progress - ${((prog / totalUploadSize) * 100).toFixed(2)}%`,
      });
    };
    return this.ipfs.add(buffer, { progress: progressUpdate });
  };

  handleIPFSUpload = async (file) => {
    try {
      // Extract out file as text
      const arrayBuffer = await readUploadedFileAsBuffer(file);
      // Save it to ipfs
      const [{ hash, size }] = await this.saveToIpfs(arrayBuffer);
      toast.update(this.toastId, {
        render: `Uploaded ${file.name ? file.name : 'file'}! \n Size: ${size}kb`,
        type: toast.TYPE.INFO,
      });
      // Return hash as a reference
      return hash;
    } catch (err) {
      console.warn(err.message);
    }
  };

  handleAfterIPFSUpload = (imageHash) => {
    console.info('Uploaded file to ipfs', imageHash);
    return `https://ipfs.io/ipfs/${imageHash}`;
  };

  handleSavingDraft(params) {
    this.props.saveDraft(this.props.uuid, params);
  }

  handleDraftChange = (e) => {
    const title = e.target.value;
    this.props.setDraftParams({ title });
    this.handleSavingDraft({ title });
  };

  handleEditorSave = (megadraft, description) => {
    if (this.props.draft.megadraft !== megadraft) {
      this.handleSavingDraft({ megadraft, description });
    }
  };

  handleImageSave = async (blob) => {
    const heroImageHash = await this.handleIPFSUpload(blob);
    this.props.setDraftParams({ heroImageHash });
    this.handleSavingDraft({ heroImageHash });
  };

  handleImageRejection = () => {
    toast.error('The file you tried to upload was too big. Try again with another file under 2mb.');
  };

  load = (uuid) => {
    this.props.fetchDraft(uuid);
  };

  componentDidMount() {
    this.load(this.props.uuid);
    this.props.closeSidebar();
  }

  render() {
    const { classes, draft, intl, isLoggedIn, isLoadingDraft, isSavingDraft } = this.props;
    const { editorState, title, heroImageHash } = draft;
    const references = [];
    if (!isLoggedIn) {
      return <Redirect to="/" />;
    }
    if (isLoadingDraft) {
      return <LoadingIndicator id="loading-indicator" fadeIn="quarter" showing={true} full />;
    }
    return (
      <div className={classes.container}>
        <section className={classes.draft}>
          <header className={classes.header}>
            <Hero
              imageHash={heroImageHash}
              onSave={this.handleImageSave}
              onRejected={this.handleImageRejection}
            />
          </header>
          <div className={classes.main}>
            <div className={classes.title}>
              <TitleEditor
                onChange={this.handleDraftChange}
                placeholder={intl.formatMessage({
                  id: 'editor_titlePlaceholder',
                  defaultMessage: 'Title here...',
                })}
                value={title}
              />
            </div>
            <div className={classes.editor}>
              <MegadraftEditor
                onUpload={this.handleIPFSUpload}
                onAfterUpload={this.handleAfterIPFSUpload}
                editorState={editorState}
                isSaving={isSavingDraft}
                onSave={this.handleEditorSave}
              />
            </div>
          </div>
        </section>
        <aside className={classes.aside}>
          {/*
             <div className={classes.block}>
            <AddtionalContent />
          </div>
             */}
          <div className={classes.block}>
            <References formatType="MLA" references={references} />
          </div>
        </aside>
      </div>
    );
  }
}

const mapStateToProps = (
  {
    auth: { isLoggedIn },
    article: {
      draft: { data: draft, loading: isLoadingDraft, saving: isSavingDraft },
    },
  },
  {
    match: {
      params: { uuid },
    },
  }
) => {
  return {
    draft: {
      ...draft,
      editorState: draft && draft.megadraft ? JSON.parse(draft.megadraft) : null,
    },
    uuid,
    isLoggedIn,
    isSavingDraft,
    isLoadingDraft,
  };
};

const mapDispatchToProps = {
  clearDraftState,
  closeSidebar,
  fetchDraft,
  saveDraft,
  setDraftParams,
  uploadFileToIPFS,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(DraftEditor)));
