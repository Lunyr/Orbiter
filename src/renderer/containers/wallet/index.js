import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import get from 'lodash/get';
import { MdStars as StarIcon } from 'react-icons/md/';
import { ButtonGroup, Button } from '../../components';
import WalletTable from './WalletTable';
import styles from './styles';

class Wallet extends React.PureComponent {
  render() {
    const { classes, wallet } = this.props;
    return (
      <div className={classes.container}>
        <header className={classes.header}>
          <div className={classes.header__top}>
            <h1 className={classes.header__title}>Wallet</h1>
            <ButtonGroup>
              <Button type="button" theme="primary" value="Private Key" />
              <Button type="button" theme="primary" value="Withdraw Funds" />
            </ButtonGroup>
          </div>
        </header>
        <div className={classes.content}>
          <section className={classes.section}>
            <h2 className={classes.section__title}>Balances</h2>
            <div className={classes.section__content}>
              <WalletTable
                data={[
                  {
                    name: 'Ethereum (ETH)',
                    balance: get(wallet, ['balances', 'ethereum']),
                    address: get(wallet, 'address'),
                    logoPath: require('../../../assets/images/ethereum.svg'),
                  },
                  {
                    name: 'Lunyr (LUN)',
                    balance: get(wallet, ['balances', 'lunyr']),
                    address: get(wallet, 'address'),
                    logoPath: require('../../../assets/images/Logo.svg'),
                  },
                ]}
                columns={[
                  {
                    id: 'balanceName',
                    Header: 'Name',
                    accessor: 'name',
                    Cell: ({ value, original }) => {
                      return (
                        <div className={classes.name}>
                          <img className={classes.image} src={original.logoPath} />
                          <span>{value}</span>
                        </div>
                      );
                    },
                  },
                  {
                    id: 'balanceValue',
                    Header: 'Balance',
                    accessor: 'balance',
                    Cell: ({ value }) => (
                      <div className={classes.balance}>
                        <span>{value}</span>
                      </div>
                    ),
                  },
                  {
                    id: 'address', // Required because our accessor is not a string
                    Header: 'Address',
                    accessor: 'address', // Custom value accessors!
                  },
                ]}
              />
            </div>
          </section>
          <section className={classes.section}>
            <h2 className={classes.section__title}>Rewards</h2>
            <div className={classes.section__content}>
              <WalletTable
                data={[
                  {
                    name: 'Honor Points (HP)',
                    balance: get(wallet, ['rewards', 'hp']),
                  },
                  {
                    name: 'Contribution Points (CP)',
                    balance: get(wallet, ['rewards', 'cp']),
                  },
                ]}
                columns={[
                  {
                    id: 'balanceName',
                    Header: 'Name',
                    accessor: 'name',
                    Cell: ({ value }) => {
                      return (
                        <div className={classes.name}>
                          <StarIcon className={classes.icon} size={30} />
                          <span>{value}</span>
                        </div>
                      );
                    },
                  },
                  {
                    id: 'balanceValue',
                    Header: 'Balance',
                    accessor: 'balance',
                    Cell: ({ value }) => (
                      <div className={classes.balance}>
                        <span>{value}</span>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ wallet }) => ({ wallet });

export default connect(mapStateToProps)(injectStyles(styles)(Wallet));
