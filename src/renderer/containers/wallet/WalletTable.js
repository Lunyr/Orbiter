import React from 'react';
import injectStyles from 'react-jss';
import { Table } from '../../components';

const WalletTable = ({ classes, ...tableProps }) => (
  <Table
    className={classes.table}
    {...tableProps}
    minRows={0}
    sortable={false}
    showPagination={false}
    resizable={false}
    defaultPageSize={tableProps.data.length}
    getTheadProps={() => ({ className: classes.thead })}
    getTheadThProps={() => ({ className: classes.thead__th })}
    getTbodyProps={() => ({ className: classes.tbody })}
    getTrGroupProps={() => ({ className: classes.tr__group })}
    getTdProps={() => ({ className: classes.td })}
    getThProps={() => ({ className: classes.th })}
    getTrProps={() => ({ className: classes.tr })}
    getNoDataProps={() => ({ className: classes.noData })}
  />
);

const styles = (theme) => ({
  table: {
    width: '100%',
    height: 'auto',
    border: 'none',
  },
  thead: {
    boxShadow: 'none !important',
  },
  thead__th: {
    borderRight: 'none !important',
    borderBottom: 'none !important',
    textAlign: 'left',
    height: 40,
    ...theme.typography.h6,
    fontWeight: 500,
    color: theme.colors.darkGray,
    textTransform: 'uppercase',
    fontSize: '0.85rem',
  },
  tbody: {
    borderRight: 'none !important',
    borderBottom: 'none !important',
  },
  tr__group: {
    borderRight: 'none !important',
    borderBottom: 'none !important',
  },
  td: {
    borderRight: 'none !important',
  },
  th: {
    textAlign: 'left',
    height: 40,
  },
  tr: {
    height: 40,
  },
  noData: {
    display: 'none !important',
  },
});

export default injectStyles(styles)(WalletTable);
