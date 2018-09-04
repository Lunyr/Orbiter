import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';
import Popover from 'react-popover';
import ReferencePopover from './ReferencePopover';
import { ArticleActions } from '../../../../redux/actions/article/ArticleActions';

class _ReferenceComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderPopover: false,
      renderReference: [],
      references: [],
      renderReferenceIndex: undefined,
    };
    this.clickHandler = undefined;
    this.reference = undefined;
  }

  toggleReference = index => {
    this.setState(
      ({ renderReference, renderReferenceIndex }) =>
        renderReferenceIndex === index
          ? {
              renderReference: [],
              renderReferenceIndex: undefined,
            }
          : {
              renderReference: renderReference ? renderReference[index] : null,
              renderReferenceIndex: index,
            },
      () => {
        if (typeof this.state.renderReferenceIndex !== 'undefined') {
          this.clickHandler = document.addEventListener('click', this.checkToClose);
        } else {
          document.removeEventListener('click', this.checkToClose);
          this.clickHandler = null;
        }
      }
    );
  };

  closeOpenedReference = () => {
    this.setState({
      renderReference: [],
      renderReferenceIndex: undefined,
    });
  };

  checkToClose = e => {
    this.closeOpenedReference();
    document.removeEventListener('click', this.checkToClose);
    this.clickHandler = null;
  };

  componentWillReceiveProps = nextProps => {
    const contentState = nextProps.contentState;
    const { referenceArray } = contentState.getEntity(nextProps.entityKey).getData();
    if (this.state.renderReference.length !== referenceArray.length) {
      this.setState({
        renderReference: [...this.state.renderReference, false],
      });
    }
  };

  render() {
    const contentState = this.props.contentState;
    const { referenceArray } = contentState.getEntity(this.props.entityKey).getData();
    const readOnly = typeof window !== 'undefined' && !window.location.pathname.includes('/edit');
    const { renderReferenceIndex } = this.state;
    return (
      <span className="referenceContainer" ref={node => (this.reference = node)}>
        <span>{this.props.children}</span>
        {referenceArray.map((reference, index) => {
          return (
            <Popover
              className={css(styles.popover)}
              body={<ReferencePopover reference={referenceArray[index]} />}
              preferPlace="below"
              key={`reference_${referenceArray[index].title}_${index}`}
              onOuterAction={this.renderReference}
              target={this.refs.referenceTarget}
              isOpen={renderReferenceIndex === index}
            >
              <sup
                className={css(styles.inlineReferenceNumber)}
                ref="referenceTarget"
                onClick={() => this.toggleReference(index)}
              >
                [{readOnly ? reference.refNum : '*'}]
              </sup>
            </Popover>
          );
        })}
      </span>
    );
  }
}

const styles = StyleSheet.create({
  inlineReferenceNumber: {
    color: '#0645AD',
    cursor: 'pointer',
    marginLeft: 3,
    ':hover': {
      color: '#3366BB',
      textDecoration: 'underline',
    },
  },
  popover: {
    zIndex: '2',
  },
});

const mapDispatchToProps = dispatch => ({
  articleActions: bindActionCreators(ArticleActions, dispatch),
});

export default connect(null, mapDispatchToProps)(_ReferenceComponent);
