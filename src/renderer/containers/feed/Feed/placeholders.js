import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { TextBlock, RectShape, RoundShape } from 'react-placeholder/lib/placeholders';
import theme from '../../../theme/index';

const styles = (theme) => ({
  feedListPlaceholder: {
    maxWidth: '100%',
  },
  featuredCardsPlaceholder: {
    maxWidth: '100%',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: theme.borderRadius * 2,
    marginBottom: theme.spacing * 3,
  },
  placeholder__small: {
    height: 70,
  },
  placeholder__header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    background: '#fdfdfd',
    padding: theme.spacing,
    flexShrink: 0,
  },
  placeholder__body: {
    background: theme.colors.lightGray,
    flexGrow: 1,
  },
  placeholder__footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    background: '#fdfdfd',
    padding: theme.spacing,
    flexShrink: 0,
  },
  nomargin: {
    marginBottom: 2,
  },
});

export const ReviewPlaceholder = injectStyles(styles)(({ classes, nomargin = false }) => (
  <section
    className={`${cx(
      classes.placeholder,
      classes.placeholder__small,
      nomargin && classes.nomargin
    )} loading-animation`}>
    <header className={classes.placeholder__header}>
      <div style={{ display: 'inline-flex', overflow: 'hidden' }}>
        <RoundShape
          color={theme.colors.lightGray}
          style={{ width: 45, height: 45, marginRight: 10 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10, width: '50%' }}>
          <div style={{ marginBottom: 10, width: 600, maxWidth: '100%' }}>
            <TextBlock rows={1} color={theme.colors.lightGray} />
          </div>
          <div style={{ width: 325 }}>
            <TextBlock rows={1} color={theme.colors.lightestGray} />
          </div>
        </div>
      </div>
    </header>
  </section>
));

export const ArticlePlaceholder = injectStyles(styles)(
  ({ classes, header = true, height = 450, imageHeight, width = 400 }) => (
    <section className={`${classes.placeholder} loading-animation`}>
      {header && (
        <header className={classes.placeholder__header}>
          <div style={{ display: 'inline-flex', overflow: 'hidden' }}>
            <RoundShape
              color={theme.colors.lightGray}
              style={{ width: 60, height: 60, marginRight: 10 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10, width: '50%' }}>
              <div style={{ marginBottom: 10, width }}>
                <TextBlock rows={1} color={theme.colors.lightGray} />
              </div>
              <div style={{ width: width / 2 }}>
                <TextBlock rows={1} color={theme.colors.lightestGray} />
              </div>
            </div>
          </div>
        </header>
      )}
      <div style={{ height: imageHeight || height * 0.75 }} className={classes.placeholder__body}>
        <RectShape color="#DBDCE1" style={{ width: '100%', height: '100%' }} />
      </div>
      <footer className={classes.placeholder__footer}>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10, width: '50%' }}>
          <div style={{ marginBottom: 10, width: width * 0.75 }}>
            <TextBlock rows={1} color={theme.colors.lightGray} />
          </div>
          <div style={{ width: width * 0.5 }}>
            <TextBlock rows={1} color={theme.colors.lightestGray} />
          </div>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', marginTop: 10, width: width * 0.75 }}>
          <TextBlock rows={1} color={theme.colors.lightGray} />
        </div>
      </footer>
    </section>
  )
);

export const FeedListPlaceholder = injectStyles(styles)(({ classes }) => (
  <div className={classes.feedListPlaceholder + ' loading-animation'}>
    <ReviewPlaceholder nomargin={true} />
    <ReviewPlaceholder nomargin={true} />
    <ReviewPlaceholder />
    <ArticlePlaceholder />
    <ReviewPlaceholder />
  </div>
));

export const FeaturedCardsPlaceholder = injectStyles(styles)(({ classes }) => (
  <div className={classes.featuredCardsPlaceholder + ' loading-animation'}>
    <ArticlePlaceholder height={300} imageHeight={200} width={300} header={false} />
    <ArticlePlaceholder height={300} imageHeight={200} width={300} header={false} />
    <ArticlePlaceholder height={300} imageHeight={200} width={300} header={false} />
  </div>
));
