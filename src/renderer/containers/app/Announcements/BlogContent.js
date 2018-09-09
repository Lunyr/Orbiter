import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';

class BlogContent extends React.Component {
  isEmpty = (obj) => {
    // null and undefined are "empty"
    if (obj === null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== 'object') return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  };

  componentDidMount() {
    const { blogActions } = this.props;

    if (this.isEmpty(this.props.selectedPost)) {
      const item = this.props.articles.find(
        (article) => article.url === this.props.match.params.url
      );
      if (!this.isEmpty(item)) {
        blogActions.selectPost(item);
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.featureContainer + ' medium-blog'}>
        <div className={classes.headingImage}>
          <img
            src={this.props.selectedPost.images[0]}
            alt={this.props.selectedPost.title}
            className={classes.imageCover}
          />
          <div className={classes.headingTitle}>
            <div className={classes.title}>{this.props.selectedPost.title}</div>
            <div className={classes.dateTime}>
              BY {this.props.selectedPost.author} |{' '}
              {moment(this.props.selectedPost.pubDate).format('MMMM D, YYYY')}
            </div>
          </div>
        </div>
        <div className={classes.blogText} id="test">
          {ReactHtmlParser(this.props.selectedPost.content)}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  featureContainer: {
    background: '#fff',
    flex: '1',
    display: 'flex',
    overflow: 'hidden',
    'min-height': '100vh',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    'text-align': 'center',
    position: 'relative',
  },
  a: {
    wordBreak: 'break-all',
  },
  headingImage: {
    height: '530px',
    background: '#2E3042',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  headingTitle: {
    'background-color': 'rgba(0,0,0,0.4)',
    padding: '20px 130px',
    position: 'absolute',
    bottom: '90px',
    width: 'auto',
    maxWidth: '470px',
    '@media only screen and (max-width: 1200px)': {
      padding: '20px 70px',
      width: 'auto',
      maxWidth: 'auto',
    },
    '@media only screen and (max-width: 768px)': {
      padding: '20px 30px',
      width: 'auto',
      maxWidth: 'auto',
      bottom: '15px',
    },
    '@media only screen and (max-width: 480px)': {
      padding: '20px 3%',
      width: 'auto',
      maxWidth: '94%',
      bottom: '15px',
    },
  },
  title: {
    color: '#FFFFFF',
    'font-family': 'Lato, sans-serif',
    'font-size': '50px',
    'line-height': '55px',
    textAlign: 'left',
    '@media only screen and (max-width: 1200px)': {
      'font-size': '28px',
      'line-height': '32px',
    },
    '@media only screen and (max-width: 768px)': {
      'font-size': '24px',
      'line-height': '26px',
    },
    '@media only screen and (max-width: 480px)': {
      'font-size': '18px',
      'line-height': '20px',
    },
  },
  dateTime: {
    color: 'rgba(255,255,255,0.7)',
    'font-family': 'Lato, sans-serif',
    'font-size': '16px',
    'line-height': '24px',
    textAlign: 'left',
    marginTop: '15px',
    textTransform: 'uppercase',
  },
  blogText: {
    margin: '0 auto',
    width: '695px',
    padding: '100px 15px',
    opacity: 0.8,
    color: '#494D5F',
    'font-family': 'Lato, sans-serif',
    'font-size': '18px',
    'line-height': '30px',
    'text-align': 'left',
    boxSizing: 'border-box',

    '@media only screen and (max-width: 768px)': {
      width: '94%',
      padding: '0 3%',
    },
  },
  imageCover: {
    width: '100%',
    'vertical-align': 'text-bottom',
    display: 'block',
  },
});

const mapStateToProps = (state) => ({
  blog: state.blog,
});

export default connect(mapStateToProps)(injectStyles(styles)(BlogContent));
