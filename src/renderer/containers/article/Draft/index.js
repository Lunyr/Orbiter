import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { injectIntl } from 'react-intl';
import styles from './styles';
import { Hero, TextAreaAutoSize } from '../../../components';

const TitleEditor = ({ className, disabled, onChange, placeholder, title }) => (
  <TextAreaAutoSize
    rows={1}
    placeholder={placeholder}
    className={className}
    onChange={onChange}
    value={title}
    disabled={disabled}
  />
);

const Editor = ({ className }) => <div className={className}>Put Megadraft Editor Content</div>;

const AddtionalContent = () => <div>Additional Content</div>;

const References = () => <div>References</div>;

class Draft extends React.Component {
  render() {
    const { classes, draft, intl } = this.props;
    const { title, imageHash } = draft;
    return (
      <div className={classes.container}>
        <header className={classes.header}>
          <Hero imageHash={imageHash} />
        </header>
        <section className={classes.draft}>
          <div className={classes.main}>
            <div className={classes.title}>
              <TitleEditor
                className={classes.titleEditor}
                onChange={(value) => console.log('changed', value)}
                placeholder={intl.formatMessage({
                  id: 'editor_titlePlaceholder',
                  defaultMessage: 'Title here...',
                })}
                title={title}
              />
            </div>
            <Editor className={classes.editor} />
          </div>
          <aside className={classes.aside}>
            <AddtionalContent />
          </aside>
        </section>
        <footer className={classes.footer}>
          <References />
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  draft: {
    title: '',
    imageHash: '',
  },
});

export default connect(mapStateToProps)(injectIntl(injectStyles(styles)(Draft)));
