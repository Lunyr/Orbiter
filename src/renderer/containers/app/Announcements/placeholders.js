import React from 'react';
import injectStyles from 'react-jss';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';

const styles = (theme) => ({
  container: {
    display: 'flex',
    maxWidth: 1270,
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  placeholder: {
    position: 'relative',
    minWidth: 350,
    maxWidth: 500,
    flexWrap: 'wrap',
    flexShrink: 0,
    flexGrow: 1,
    minHeight: 300,
    margin: '30px 17px',
    backgroundColor: theme.colors.white,
  },
});

export const BlogPlaceholder = injectStyles(styles)(({ classes }) => (
  <section className={`${classes.placeholder} loading-animation`}>
    <RectShape color="#DBDCE1" style={{ width: '100%', height: 'calc(100% - 100px)' }} />
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10, width: '50%' }}>
      <div style={{ marginBottom: 10, width: 200, marginLeft: 10 }}>
        <TextBlock rows={3} color="#eee" />
      </div>
    </div>
  </section>
));

export const BlogListPlaceholder = injectStyles(styles)(({ classes }) => (
  <div className={`${classes.container} loading-animation`}>
    <BlogPlaceholder />
    <BlogPlaceholder />
    <BlogPlaceholder />
    <BlogPlaceholder />
    <BlogPlaceholder />
    <BlogPlaceholder />
  </div>
));
