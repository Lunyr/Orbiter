import React from 'react';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import SectionTitlePlugin from 'megadraft-section-title';
import UploadImagePlugin from 'megadraft-image-plugin';
import VideoUploadPlugin from 'megadraft-video-plugin';
import ErrorBoundary from '../ErrorBoundary';
import ReferenceInput from './entities/references/ReferenceInput';
import LinkInput from 'megadraft/lib/entity_inputs/LinkInput';
import TitleInput from './entities/title/TitleInput';
import actions from './actions';
import styles from './styles';
import decorator from './decorator';

const Editor = ({ editorState, onChange, onUploadFile, onUpload, readOnly = false }) => {
  const megadraftOptions = {
    onUploadFile,
    uploadCallback: onUpload,
  };
  const plugins = [
    SectionTitlePlugin,
    UploadImagePlugin(megadraftOptions),
    VideoUploadPlugin(megadraftOptions),
  ];
  return (
    <ErrorBoundary errorMsg="There was an error while trying to load the editor state">
      <MegadraftEditor
        editorState={editorStateFromRaw(editorState, decorator)}
        onChange={onChange}
        plugins={plugins}
        actions={actions}
        customStyleMap={styles}
        readOnly={readOnly}
        entityInputs={{
          // REFERENCE: ReferenceInput,
          LINK: LinkInput,
          // STRIKETHROUGH: LinkInput,
          TITLE: TitleInput,
        }}
      />
    </ErrorBoundary>
  );
};

export default Editor;
