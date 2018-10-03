import React from 'react';
import orderBy from 'lodash/orderBy';
import injectStyles from 'react-jss';
import { Label } from '../../components/index';

const TagsView = ({ classes, onApproval, selected, tags = [] }) => (
  <div className={classes.tagsView}>
    <header className={classes.tagsView__header}>
      <h2 className={classes.tagsView__title}>
        {`${selected.toUpperCase()}`}
        <small className={classes.title__sub}>{`(${tags.length})`}</small>
      </h2>
    </header>
    <div className={classes.tagsView__content}>
      {!tags || tags.length === 0 ? (
        <h3 className={classes.tagsView__empty}>
          There are no article tags starting with {`"${selected.toUpperCase()}"`}
        </h3>
      ) : (
        <ul className={classes.tagsView__list}>
          {orderBy(tags, 'name', 'asc').map(({ tagId, articleCount, active, name }) => (
            <li key={tagId} className={classes.tagsView__item}>
              <h4 className={classes.tagsView__tag}>{name}</h4>
              {!active ? (
                <React.Fragment>
                  <Label type="gray" value="PENDING" />
                  {onApproval && (
                    <a
                      className={classes.approveLink}
                      onClick={(e) => {
                        e.preventDefault();
                        onApproval(name);
                      }}>
                      Approve
                    </a>
                  )}
                </React.Fragment>
              ) : (
                <Label className={classes.tag__count} type="primary" value={articleCount || 0} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

const styles = (theme) => ({
  approveLink: {
    textDecoration: 'none',
    marginLeft: theme.spacing,
    color: theme.colors.blue,
    cursor: 'pointer',
    ...theme.typography.small,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
  },
  tagsView: {
    height: '100%',
    width: `calc(100% - ${theme.spacing * 4 + 90}px)`,
    paddingLeft: theme.spacing * 2,
    paddingRight: theme.spacing * 2,
    backgroundColor: theme.colors.white,
  },
  tagsView__header: {
    display: 'flex',
    alignItems: 'center',
    height: 60,
    flexShrink: 0,
  },
  tagsView__title: {
    ...theme.typography.h2,
    margin: 0,
    fontSize: '1.65rem',
    color: theme.colors.black,
    fontWeight: 400,
  },
  title__sub: {
    marginLeft: theme.spacing * 0.5,
    color: theme.colors.darkGray,
    fontSize: '1rem',
    position: 'relative',
    bottom: 3,
  },
  tagsView__content: {
    display: 'flex',
    flexGrow: 1,
    height: 'auto',
    width: '100%',
    paddingTop: theme.spacing,
    paddingBottom: theme.spacing,
  },
  tagsView__empty: {
    ...theme.typography.body,
    color: theme.colors.gray,
    margin: 0,
  },
  tagsView__list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    width: '100%',
  },
  tagsView__item: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 35,
    width: '100%',
  },
  tagsView__tag: {
    ...theme.typography.body,
    marginRight: theme.spacing,
    fontWeight: 500,
  },
  label: {
    borderRadius: 100,
  },
  tag__count: {
    height: 25,
    width: 25,
    borderRadius: 100,
    color: theme.colors.white,
    padding: 0,
  },
});

export default injectStyles(styles)(TagsView);
