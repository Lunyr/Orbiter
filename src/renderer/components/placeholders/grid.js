import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { RoundShape, RectShape, TextBlock } from 'react-placeholder/lib/placeholders';
import theme from '../../theme/index';
import 'react-placeholder/lib/reactPlaceholder.css';

const styles = (theme) => ({
  container: {
    display: 'flex',
    margin: '0 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'auto',
  },
  placeholder: {
    position: 'relative',
    width: 300,
    height: 375,
    padding: theme.spacing,
    backgroundColor: 'transparent',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius,
  },
  container__list: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'none',
    marginBottom: theme.spacing * 2,
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    minHeight: 50,
    height: 80,
    minWidth: '75%',
    maxWidth: 767,
    maxHeight: 80,
    flexShrink: 0,
    flexGrow: 0,
    backgroundColor: theme.colors.white,
  },
});

export const CardPlaceholder = injectStyles(styles)(({ classes }) => (
  <section className={cx({ [classes.placeholder]: true, 'loading-animation': true })}>
    <div className={classes.inner}>
      <RectShape color="#DBDCE1" style={{ width: '100%', height: 200 }} />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 25, width: '75%' }}>
        <div style={{ marginBottom: 15, width: 275, marginLeft: 15 }}>
          <TextBlock rows={1} color={theme.colors.lightGray} />
        </div>
        <div style={{ marginTop: 15, width: 275, marginLeft: 15 }}>
          <TextBlock rows={4} color={theme.colors.lightestGray} />
        </div>
      </div>
    </div>
  </section>
));

export const ListCardPlaceholder = injectStyles(styles)(({ classes }) => (
  <section
    className={cx({
      [classes.placeholder]: true,
      [classes.list]: true,
      'loading-animation': true,
    })}>
    <div style={{ display: 'inline-flex', flexDirection: 'row', width: '100%' }}>
      <div style={{ width: '35%', marginLeft: 10, display: 'flex', alignItems: 'center' }}>
        <TextBlock rows={1} color={theme.colors.lightGray} />
      </div>
      <div style={{ width: '20%', marginLeft: 10, display: 'flex', alignItems: 'center' }}>
        <TextBlock rows={1} color={theme.colors.lightGray} />
      </div>
      <div
        style={{
          width: '25%',
          marginLeft: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextBlock rows={1} color={theme.colors.lightGray} />
      </div>
      <div style={{ width: '20%', marginLeft: 10, display: 'flex', justifyContent: 'center' }}>
        <RoundShape style={{ width: 40, height: 40 }} color={theme.colors.lightGray} />
      </div>
    </div>
  </section>
));

export const GridViewPlaceholder = injectStyles(styles)(({ classes, n = 6 }) => (
  <div className={cx({ [classes.container]: true, 'loading-animation': true })}>
    {[...Array(n).keys()].map((i) => <CardPlaceholder classes={classes} key={i} />)}
  </div>
));

export const ListViewPlaceholder = injectStyles(styles)(({ classes, n = 3 }) => (
  <div
    className={cx({
      [classes.container]: true,
      [classes.container__list]: true,
      'loading-animation': true,
    })}>
    {[...Array(n).keys()].map((i) => <ListCardPlaceholder classes={classes} key={i} />)}
  </div>
));
