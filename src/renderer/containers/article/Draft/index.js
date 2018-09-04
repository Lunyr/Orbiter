import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { injectIntl } from 'react-intl';
import {
  persistDraftEditorState,
  setDraftTitle,
} from '../../../../shared/redux/modules/article/draft/actions';
import { MegadraftEditor, ErrorBoundary, Hero, TitleEditor } from '../../../components';
import References from '../references/References';
import styles from './styles';

const AddtionalContent = () => <div>Additional Content</div>;

class Draft extends React.Component {
  handleAfterUpload = (upload) => {
    console.log('upload hash', upload);
  };

  handleDraftChange = (e) => {
    this.props.setDraftTitle(e.target.value);
  };

  handleEditorSave = (editorState) => {
    this.props.persistDraftEditorState(editorState);
  };

  render() {
    const { classes, draft, intl } = this.props;
    const { editorState, title, imageHash } = draft;
    const references = [];
    return (
      <ErrorBoundary
        errorMsg={intl.formatMessage({
          id: 'editor_error',
          defaultMessage:
            "Oh no, something went wrong! It's okay though, please refresh and your content should return.",
        })}>
        <div className={classes.container}>
          <section className={classes.draft}>
            <header className={classes.header}>
              <Hero imageHash={imageHash} />
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
                  addWordCount={true}
                  afterUpload={this.handleAfterUpload}
                  editorState={editorState}
                  onSave={this.handleEditorSave}
                />
              </div>
              <footer className={classes.footer}>
                <References formatType="MLA" references={references} />
              </footer>
            </div>
          </section>
          <aside className={classes.aside}>
            <AddtionalContent />
          </aside>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ article: { draft } }) => ({
  draft: {
    ...draft,
    editorState: JSON.parse(draft.editorState),
  },
});

const mapDispatchToProps = {
  persistDraftEditorState,
  setDraftTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(injectStyles(styles)(Draft)));
