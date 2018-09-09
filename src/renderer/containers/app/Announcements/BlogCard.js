import React from 'react';
import injectStyles from 'react-jss';
import { Link, withRouter } from 'react-router-dom';

class BlogCard extends React.Component {
  render() {
    const { classes, url, images, title, pubDate } = this.props;

    return (
      <div className={classes.blogPostContainer}>
        <Link to={'/blog/' + url}>
          <div className={classes.blogPostImage}>
            <span className={classes.verticalAlign} />
            <img src={images[0]} alt={title} className={classes.introImage} />
          </div>
        </Link>
        <div className={classes.dateCreated}>{pubDate}</div>
        <Link to={'/blog/' + url} className={classes.titleLink}>
          <h2 className={classes.title}>{title}</h2>
        </Link>
      </div>
    );
  }
}

const styles = (theme) => ({
  featureContainer: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    padding: '0 15px',
    'text-align': 'center',
    position: 'relative',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    'padding-bottom': '60px',
    'margin-top': '80px',

    '@media only screen and (max-width: 767px)': {
      'margin-top': '50px',
    },

    '@media only screen and (min-width: 1024px)': {
      'min-height': '500px',
      'margin-top': '60px',
    },
  },
  blogPostContainer: {
    'flex-grow': '1',
    width: 'calc(33% - 34px)',
    maxWidth: '380px',
    minHeight: '460px',
    margin: '30px 17px',
    'background-color': '#fff',
    transition: '.5s ease-in-out',
    borderRadius: '5px',
    ':hover': {
      transform: 'scale(1.08)',
    },
    'box-shadow': '0 22px 44px 0 rgba(0,0,0,0.15)',

    '@media only screen and (max-width: 1440px)': {
      minHeight: '360px',
      width: 'calc(50% - 34px)',
    },
    '@media only screen and (max-width: 1200px)': {
      minHeight: 'auto',
      width: 'calc(50% - 34px)',
    },
    '@media only screen and (max-width: 768px)': {
      minHeight: 'auto',
      width: 'calc(50% - 34px)',
      margin: 0,
      borderRadius: 0,
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    },
    '@media only screen and (max-width: 480px)': {
      minHeight: 'auto',
      width: 'calc(100% - 34px)',
      'max-width': '100%',
      margin: 0,
      borderRadius: 0,
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    },
  },
  blogPostImage: {
    height: '300px',
    width: '380px',
    overflow: 'hidden',
    'background-color': '#262835',

    '@media only screen and (max-width: 1440px)': {
      height: '200px',
      width: '100%',
    },
    '@media only screen and (max-width: 1200px)': {
      height: '180px',
      width: '100%',
    },
    '@media only screen and (max-width: 768px)': {
      height: '150px',
      width: '100%',
    },
    '@media only screen and (max-width: 480px)': {
      height: '200px',
      width: '100%',
    },
  },
  verticalAlign: {
    display: 'inline-block',
    height: '100%',
    'vertical-align': 'middle',
  },
  introImage: {
    width: '100%',
    position: 'relative',
    'vertical-align': 'middle',
  },
  dateCreated: {
    padding: '40px 30px 0 30px',
    opacity: '0.6',
    color: '#2F3339',
    'text-align': 'left',
    'font-family': 'Lato, sans-serif',
    'font-size': '12px',
    'font-weight': '500',
    'letter-spacing': '1px',
    'line-height': '15px',
    'text-decoration': 'none',
  },
  titleLink: {
    'text-decoration': 'none',
  },
  title: {
    padding: '0 30px 40px 30px',
    minHeight: '96px',
    margin: '0',
    opacity: '0.8',
    color: '#2F3339',
    'text-align': 'left',
    'font-family': 'Lato, sans-serif',
    'font-size': '24px',
    'line-height': '32px',
  },
});

export default withRouter(injectStyles(styles)(BlogCard));
