/***
 * Custom entity for Megadraft.io to insert references
 * @craiglu
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';

// Forms
import WebsiteRefForm from './forms/WebsiteRefForm';
import BookRefForm from './forms/BookRefForm';
import NewsRefForm from './forms/NewsRefForm';
import OtherRefForm from './forms/OtherRefForm';
import ExistingReferences from './ExistingReferences';

// Actions
import { ArticleActions } from '../../../../redux/actions/article/ArticleActions';

import icons from 'megadraft/lib/icons.js';

const ACTIVE_TABS = [
  { label: 'Website', id: 'website' },
  { label: 'Book', id: 'book' },
  { label: 'News', id: 'news' },
  { label: 'Other', id: 'other' },
];

const PARAGRAPH_CLASSNAME = 'public-DraftStyleDefault-block public-DraftStyleDefault-ltr';
const REFERENCE_CONTAINER_CLASSNAME = 'referenceContainer';
const SUP_CLASSNAME = 'inline-reference';
const SUP_LENGTH = 3;

class ReferenceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      author: '',
      firstName: '',
      lastName: '',
      title: '',
      url: '',
      website: '',
      publisher: '',
      yearOfPub: '',
      pagesCited: '',
      sourceTitle: '',
      nameOfPub: '',
      date: '',
      activeTab: 'references',
      edit: false,
      index: '',
      creation_date: '',
      updated_date: '',
      lastAccessed: '',
    };
  }

  componentDidMount() {
    this.updateReferenceMap(this.props.editorState);
    this.setSelectionToLastWord();
  }

  /***
   * Sets the reference
   * @params {reference} -- the reference object with author, first name, etc.
   * @params string entityKey -- the current selections entity key
   */
  setReference = (reference, entityKey) => {
    const contentState = this.props.editorState.getCurrentContent();
    const prevReferenceArray = contentState.getEntity(entityKey).getData().referenceArray;
    const referenceData = { referenceArray: [...prevReferenceArray, ...reference] };
    contentState.replaceEntityData(entityKey, referenceData);
  };

  /***
   * Initializes the first reference in the reference array
   * @params {reference} -- the reference object with author, first name, etc.
   */
  setFirstReference = reference => {
    const referenceArray = reference;
    this.props.setEntity({ referenceArray });
  };

  /***
   * Gets the current enitty key of the selection
   * @return string entityKey -- the entity key of the selection
   */
  getCurrentEntityKey() {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const contentState = editorState.getCurrentContent();
    const anchorBlock = contentState.getBlockForKey(anchorKey);
    const offset = selection.getEndOffset();
    const index = offset - 1;
    return anchorBlock.getEntityAt(index);
  }

  /***
   * Gets the old references that we've already done
   */
  getReferences = () => {
    const entityKey = this.getCurrentEntityKey();
    if (!entityKey) {
      return null;
    }
    const contentState = this.props.editorState.getCurrentContent();
    return contentState.getEntity(entityKey).getData().referenceArray;
  };

  /***
   * Which set of references to render
   */
  renderReferences = () => {
    this.setState({
      activeTab: 'references',
    });
  };

  setActive = id => {
    this.setState({
      activeTab: id,
    });
  };

  reset = () => {
    this.setState({
      author: '',
      firstName: '',
      lastName: '',
      title: '',
      url: '',
      website: '',
      publisher: '',
      yearOfPub: '',
      pagesCited: '',
      sourceTitle: '',
      nameOfPub: '',
      date: '',
      creation_date: '',
      updated_date: '',
      edit: false,
      index: '',
      lastAccessed: '',
    });

    this.props.cancelEntity();
  };
  switchTabs = id => {
    this.setActive(id);
  };

  onFirstNameChange = event => {
    event.stopPropagation();
    const firstName = event.target.value;

    if (firstName === '') {
      this.props.cancelError();
    }

    this.setState({
      firstName: firstName,
    });
  };

  onLastNameChange = event => {
    event.stopPropagation();
    const lastName = event.target.value;

    if (lastName === '') {
      this.props.cancelError();
    }

    this.setState({
      lastName: lastName,
    });
  };

  onTitleChange = event => {
    event.stopPropagation();
    const title = event.target.value;

    if (title === '') {
      this.props.cancelError();
    }

    this.setState({
      title: title,
    });
  };

  onLastAccessedChange = event => {
    event.stopPropagation();
    const lastAccessed = event.target.value;

    if (lastAccessed === '') {
      this.props.cancelError();
    }

    this.setState({
      lastAccessed: lastAccessed,
    });
  };

  onUrlChange = event => {
    event.stopPropagation();
    const url = event.target.value;

    if (url === '') {
      this.props.cancelError();
    }

    this.setState({
      url: url,
    });
  };

  onWebsiteChange = event => {
    event.stopPropagation();
    const website = event.target.value;

    if (website === '') {
      this.props.cancelError();
    }

    this.setState({
      website: website,
    });
  };

  onPublisherChange = event => {
    event.stopPropagation();
    const publisher = event.target.value;

    if (publisher === '') {
      this.props.cancelError();
    }

    this.setState({
      publisher: publisher,
    });
  };

  onYearOfPubChange = event => {
    event.stopPropagation();
    const yearOfPub = event.target.value;

    if (yearOfPub === '') {
      this.props.cancelError();
    }

    this.setState({
      yearOfPub: yearOfPub,
    });
  };

  onPagesCitedChange = event => {
    event.stopPropagation();
    const pagesCited = event.target.value;

    if (pagesCited === '') {
      this.props.cancelError();
    }

    this.setState({
      pagesCited: pagesCited,
    });
  };

  onSourceTitleChange = event => {
    event.stopPropagation();
    const sourceTitle = event.target.value;

    if (sourceTitle === '') {
      this.props.cancelError();
    }

    this.setState({
      sourceTitle: sourceTitle,
    });
  };

  onNameOfPubChange = event => {
    event.stopPropagation();
    const nameOfPub = event.target.value;

    if (nameOfPub === '') {
      this.props.cancelError();
    }

    this.setState({
      nameOfPub: nameOfPub,
    });
  };

  onDateChange = event => {
    event.stopPropagation();
    const date = event.target.value;

    if (date === '') {
      this.props.cancelError();
    }

    this.setState({
      date: date,
    });
  };

  addReferenceToMap = reference => {
    let { articleActions } = this.props;
    const selection = this.props.editorState.getSelection();
    const block_key = selection.getAnchorKey();
    articleActions.addReference(block_key, reference);
  };

  assembleReference = () => {
    const selection = this.props.editorState.getSelection();
    const endOffset = selection.getEndOffset();
    const block_key = selection.getAnchorKey();
    let { auth } = this.props;
    let reference = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      title: this.state.title,
      url: this.state.url,
      website: this.state.website,
      publisher: this.state.publisher,
      yearOfPub: this.state.yearOfPub,
      pagesCited: this.state.pagesCited,
      sourceTitle: this.state.sourceTitle,
      nameOfPub: this.state.nameOfPub,
      date: this.state.date,
      typeOfReference: this.state.activeTab,
      block_key: block_key,
      endOffset: endOffset,
      author: auth.account.username,
      updated_date: Date.now(),
      refNum: 0,
      lastAccessed: this.state.lastAccessed,
    };

    if (!this.state.creation_date) {
      reference['creation_date'] = Date.now();
    }

    let entityKey = this.getCurrentEntityKey();
    this.addReferenceToMap(reference);
    if (entityKey) {
      this.setReference([reference], entityKey);
    } else {
      this.setFirstReference([reference]);
    }
  };

  /***
   * Counting the number of references in front of the selector
   * @param html currNode -- the current node of the selection
   * @param [childNodes] -- all the childNodes of the parent
   * @return int count -- the number of references in front of the selector
   */
  numReferencesInFront = (currNode, childNodes) => {
    let referenceNodes = [];
    for (let i = 0; i < childNodes.length; i++) {
      // If we're at the current node, don't move any further
      if (childNodes[i] === currNode) {
        break;
      }
      if (childNodes[i].className === REFERENCE_CONTAINER_CLASSNAME) {
        referenceNodes.push(childNodes[i]);
      }
    }

    let count = 0;
    for (i = 0; i < referenceNodes.length; i++) {
      count += referenceNodes[i].getElementsByClassName(SUP_CLASSNAME).length;
    }

    return count;
  };

  /***
   * Counts the number of characters until we reach the selectedNode
   * @param html currNode -- the current node of the selection
   * @param [childNodes] -- all the childNodes of the parent
   * @return int numCharsTotal -- the number of characters offset in front of the selectedNode
   */
  fullCharacterOffset = (currNode, childNodes) => {
    let numCharsTotal = 0;
    for (let i = 0; i < childNodes.length; i++) {
      // If we're at the current node, don't move any further
      if (childNodes[i] === currNode) {
        break;
      }
      numCharsTotal += childNodes[i].textContent.length;
      if (childNodes[i].className === REFERENCE_CONTAINER_CLASSNAME) {
        let numSup = childNodes[i].getElementsByClassName(SUP_CLASSNAME).length;
        numCharsTotal -= SUP_LENGTH * numSup;
      }
    }

    return numCharsTotal;
  };

  /***
   * Set selection to last word selected
   */
  setSelectionToLastWord = () => {
    try {
      const selection = this.props.editorState.getSelection();
      const anchorKey = selection.getAnchorKey();

      // Gets the last word selected out of the selection group
      let select = window.getSelection();
      select.collapseToEnd();
      select.modify('extend', 'left', 'word');

      // Gets the parent paragraph class
      let parent = select.anchorNode;
      let currentClassName = parent.className;
      while (currentClassName !== PARAGRAPH_CLASSNAME) {
        parent = parent.parentNode;
        currentClassName = parent.className;
      }

      // Gets the current node right below the parent
      let currNode = select.anchorNode;
      let onCurrentNode = false;
      if (currNode.dataset && currNode.dataset.offsetKey.includes(anchorKey)) {
        onCurrentNode = true;
      }
      while (!onCurrentNode) {
        currNode = currNode.parentNode;
        if (currNode.parentNode.className === REFERENCE_CONTAINER_CLASSNAME) {
          currNode = currNode.parentNode;
          onCurrentNode = true;
        } else if (
          currNode.dataset &&
          currNode.dataset.offsetKey &&
          currNode.dataset.offsetKey.includes(anchorKey)
        ) {
          onCurrentNode = true;
        }
      }
    } catch (e) {
      console.log(e);
      // throw new Error(e);
    }
  };

  /***
   * Updating the reference map
   */
  updateReferenceMap = editorState => {
    let { articleActions, article } = this.props;

    const referenceMap = editorState
      .getCurrentContent()
      .getBlockMap()
      ._list._tail.array.map((block, index) => {
        const references = article.referenceMap[index]
          ? [...article.referenceMap[index].references]
          : [];
        return { key: block[0], references: references };
      });

    articleActions.initializeReferenceMap(referenceMap);
  };

  onKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.assembleReference();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.reset();
    }
  };

  removeReference = index => {
    const referenceArray = this.getReferences();
    const editedArray = [...referenceArray];
    editedArray.splice(index, 1);
    this.props.setEntity({ referenceArray: editedArray });
    if (editedArray.length === 0) {
      this.props.removeEntity();
    }
  };

  editReference = index => {
    let { auth } = this.props;

    const referenceArray = this.getReferences();
    let reference = { ...referenceArray[index] };
    reference['firstName'] = this.state.firstName;
    reference['lastName'] = this.state.lastName;
    reference['title'] = this.state.title;
    reference['url'] = this.state.url;
    reference['website'] = this.state.website;
    reference['publisher'] = this.state.publisher;
    reference['yearOfPub'] = this.state.yearOfPub;
    reference['pagesCited'] = this.state.pagesCited;
    reference['sourceTitle'] = this.state.sourceTitle;
    reference['nameOfPub'] = this.state.nameOfPub;
    reference['date'] = this.state.date;
    reference['typeOfReference'] = this.state.activeTab;
    reference['lastAccessed'] = this.state.lastAccessed;
    reference['author'] = auth.account.username;
    reference['updated_date'] = Date.now();

    let editedArray = [...referenceArray];
    editedArray[index] = reference;
    this.props.setEntity({ referenceArray: editedArray });
  };

  editButton = index => {
    const referenceArray = this.getReferences();
    const activeTab = referenceArray[index].typeOfReference;
    this.setState({
      firstName: referenceArray[index].firstName,
      lastName: referenceArray[index].lastName,
      title: referenceArray[index].title,
      url: referenceArray[index].url,
      website: referenceArray[index].website,
      publisher: referenceArray[index].publisher,
      yearOfPub: referenceArray[index].yearOfPub,
      pagesCited: referenceArray[index].pagesCited,
      sourceTitle: referenceArray[index].sourceTitle,
      nameOfPub: referenceArray[index].nameOfPub,
      date: referenceArray[index].date,
      edit: true,
      activeTab: activeTab,
      index: index,
      lastAccessed: referenceArray[index].lastAccessed,
    });
  };

  /***
   * focus the input fields on click
   */
  focus = e => {
    e.target.focus();
  };

  render() {
    const tabs = ACTIVE_TABS.map((tab, index) => {
      return (
        <button
          key={`referenceTabs_${index}`}
          className={css(styles.tab, this.state.activeTab === tab.id && styles.activeTab)}
          onClick={() => this.switchTabs(tab.id)}
        >
          {tab.label}
        </button>
      );
    });

    const referenceArray = this.getReferences();
    return (
      <div className={css(styles.referencePopupContainer)}>
        <button
          onClick={this.props.cancelEntity}
          type="button"
          className={css(styles.buttonContainer) + ' toolbar__button toolbar__input-button'}
        >
          <icons.CloseIcon />
        </button>
        <div className={css(styles.referenceBodyContainer)}>
          <span className={css(styles.referencesTitle)}>References</span>
          <span className={css(styles.instructions)}>
            Add a new reference from website, book, news, or other source by clicking one of four
            different tabs.
          </span>
          <div className={css(styles.tabsContainer)}>{tabs}</div>
          {(() => {
            switch (this.state.activeTab) {
              case 'references':
                return (
                  <ExistingReferences
                    referenceArray={referenceArray}
                    removeReference={this.removeReference}
                    editButton={this.editButton}
                  />
                );
              case 'website':
                return (
                  <WebsiteRefForm
                    onUrlChange={this.onUrlChange}
                    onTitleChange={this.onTitleChange}
                    onWebsiteChange={this.onWebsiteChange}
                    onFirstNameChange={this.onFirstNameChange}
                    onLastNameChange={this.onLastNameChange}
                    onLastAccessedChange={this.onLastAccessedChange}
                    submitReference={this.assembleReference}
                    renderReferences={this.renderReferences}
                    edit={this.state.edit}
                    index={this.state.index}
                    focus={this.focus}
                    editReference={this.editReference}
                    reference={this.state}
                  />
                );
              case 'book':
                return (
                  <BookRefForm
                    onTitleChange={this.onTitleChange}
                    onPublisherChange={this.onPublisherChange}
                    onYearOfPubChange={this.onYearOfPubChange}
                    onFirstNameChange={this.onFirstNameChange}
                    onLastNameChange={this.onLastNameChange}
                    onPagesCitedChange={this.onPagesCitedChange}
                    submitReference={this.assembleReference}
                    renderReferences={this.renderReferences}
                    edit={this.state.edit}
                    index={this.state.index}
                    editReference={this.editReference}
                    reference={this.state}
                    focus={this.focus}
                  />
                );
              case 'news':
                return (
                  <NewsRefForm
                    onUrlChange={this.onUrlChange}
                    onSourceTitleChange={this.onSourceTitleChange}
                    onNameOfPubChange={this.onNameOfPubChange}
                    onFirstNameChange={this.onFirstNameChange}
                    onLastNameChange={this.onLastNameChange}
                    onDateChange={this.onDateChange}
                    submitReference={this.assembleReference}
                    renderReferences={this.renderReferences}
                    edit={this.state.edit}
                    index={this.state.index}
                    editReference={this.editReference}
                    reference={this.state}
                    focus={this.focus}
                  />
                );
              case 'other':
                return (
                  <OtherRefForm
                    onTitleChange={this.onTitleChange}
                    onUrlChange={this.onUrlChange}
                    onFirstNameChange={this.onFirstNameChange}
                    onLastNameChange={this.onLastNameChange}
                    submitReference={this.assembleReference}
                    renderReferences={this.renderReferences}
                    edit={this.state.edit}
                    index={this.state.index}
                    editReference={this.editReference}
                    reference={this.state}
                    focus={this.focus}
                  />
                );
              default:
                return (
                  <WebsiteRefForm
                    onUrlChange={this.onUrlChange}
                    onTitleChange={this.onTitleChange}
                    onWebsiteChange={this.onWebsiteChange}
                    onFirstNameChange={this.onFirstNameChange}
                    onLastNameChange={this.onLastNameChange}
                    submitReference={this.assembleReference}
                    renderReferences={this.renderReferences}
                    edit={this.state.edit}
                    index={this.state.index}
                    editReference={this.editReference}
                    reference={this.state}
                    focus={this.focus}
                  />
                );
            }
          })()}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  instructions: {
    color: '#3A3B4A',
    fontFamily: 'Roboto',
    fontSize: '14px',
    opacity: '.6',
    lineHeight: '19px',
    textAlign: 'left',
    marginTop: '9px',
    marginBottom: '30px',
  },
  referencePopupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '538px',
    overflow: 'auto',
    background: '#fff',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    left: '-60px',
    bottom: '0px',
    // boxShadow: '0 7px 24px 0, rgba(0, 0, 0, .1)',
  },
  buttonContainer: {
    padding: '0px',
    outline: 'none',
    position: 'absolute',
    top: '20px',
    right: '20px',
    height: '24px',
    width: '24px',
  },
  input: {
    margin: '10px',
    border: '1px solid #fff',
    height: '10px',
    fontFamily: 'Roboto',
  },
  referenceBodyContainer: {
    padding: '44px 50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  referencesTitle: {
    color: '#3C394C',
    fontFamily: 'Roboto',
    fontSize: '24px',
    lineHeight: '28px',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  tab: {
    width: '102px',
    height: '36px',
    background: '#F2F2F2',
    border: 'none',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',

    ':hover': {
      background: '#CCCCCC',
    },
  },
  activeTab: {
    background: '#CCCCCC',
  },
});

const mapStateToProps = state => ({
  article: state.article,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  articleActions: bindActionCreators(ArticleActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceInput);
