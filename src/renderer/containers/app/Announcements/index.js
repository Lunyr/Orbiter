import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import injectStyles from 'react-jss';
import ReactPlaceholder from 'react-placeholder';
import BlogCard from './BlogCard';
import { BlogListPlaceholder } from './placeholders';
import { fetchBlogPosts } from '../../../../shared/redux/modules/blog/actions';

class MediumBlog extends React.Component {
  maxPosts = 9;

  componentDidMount() {
    this.props.fetchBlogPosts();
  }

  render() {
    const { blog, classes } = this.props;
    return (
      <div className={classes.featureContainer}>
        <h1 className={classes.title}>
          <FormattedMessage id="announcements_title" defaultMessage="Announcements" />
        </h1>
        <ReactPlaceholder
          customPlaceholder={<BlogListPlaceholder />}
          ready={!blog.isFetchingPosts}
          showLoadingAnimation={true}>
          <div className={classes.postsContainer}>
            {blog.english.map((item, index) => {
              if (index === this.maxPosts) {
                return null;
              }
              return <BlogCard key={index} {...item} />;
            })}
          </div>
        </ReactPlaceholder>
      </div>
    );
  }
}

const styles = (theme) => ({
  featureContainer: {
    backgroundColor: theme.colors.white,
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    paddingBottom: 60,
  },
  title: {
    ...theme.typography.h2,
    marginTop: 10,
    '@media only screen and (max-width: 1024px)': {
      display: 'none',
    },
  },
  postsContainer: {
    maxWidth: 1270,
    margin: '0 auto',
    flexWrap: 'wrap',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 30,
  },
});

const mapStateToProps = ({ blog }) => ({ blog });

const mapDispatchToProps = {
  fetchBlogPosts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(MediumBlog));
