import React from 'react';
import injectStyles from 'react-jss';
import { editorStateFromRaw, editorStateToJSON, MegadraftEditor as Megadraft } from 'megadraft';
import SectionTitlePlugin from 'megadraft-section-title';
import UploadImagePlugin from 'megadraft-image-plugin';
import VideoUploadPlugin from 'megadraft-video-plugin';
import debounce from 'lodash/debounce';
import identity from 'lodash/identity';
import decorator from './decorator';
import ErrorBoundary from '../ErrorBoundary';
import ReferenceInput from './entities/references/ReferenceInput';
import LinkInput from 'megadraft/lib/entity_inputs/LinkInput';
import TitleInput from './entities/title/TitleInput';
import actions from './actions';
import { customStyleMap } from './styles';
import styles from './styles';

class MegadraftEditor extends React.Component {
  state = {
    editorState: undefined,
  };

  constructor(props) {
    super(props);
    this.handleSaveEditor = debounce(this.handleSaveEditor, 1000);
  }
  static getDerivedStateFromProps(props, state) {
    if (typeof state.editorState === 'undefined') {
      return {
        editorState: editorStateFromRaw(props.editorState, decorator),
      };
    }
    return state;
  }

  handleSaveEditor = () => {
    this.props.onSave(editorStateToJSON(this.state.editorState));
  };

  handleEditorChange = (editorState) => {
    this.setState({ editorState }, this.handleSaveEditor);
  };

  getArticleWordCount = () => {
    try {
      const { editorState } = this.state;
      if (!editorState) {
        return 0;
      }
      const content = editorState.getCurrentContent();
      const plaintext = content.getPlainText();
      if (!plaintext) {
        return 0;
      }
      return plaintext
        .trim()
        .split(' ')
        .filter(identity).length;
    } catch (error) {
      console.error('There was an error handling word count for the article.', error);
      return 0;
    }
  };

  render() {
    const { addWordCount, classes, onUploadFile, onUpload, readOnly = false } = this.props;
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
        <div className={classes.editor}>
          {addWordCount && (
            <div className={classes.wordCount}>Words: {this.getArticleWordCount()}</div>
          )}
          <Megadraft
            actions={actions}
            customStyleMap={customStyleMap}
            editorState={this.state.editorState}
            entityInputs={{
              REFERENCE: ReferenceInput,
              LINK: LinkInput,
              TITLE: TitleInput,
            }}
            plugins={plugins}
            onChange={this.handleEditorChange}
            readOnly={readOnly}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default injectStyles(styles)(MegadraftEditor);
