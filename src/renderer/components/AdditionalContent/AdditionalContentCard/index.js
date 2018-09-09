import React from 'react';
import injectStyles from 'react-jss';
import styles from './styles';

const AdditionalContentDetails = ({ classes, caption }) => (
  <div className={classes.details}>
    <p className={classes.details__caption}>{caption}</p>
  </div>
);

class AdditionalContentCard extends React.Component {
  renderCard = () => {
    const { classes, hash, type, title } = this.props;

    switch (type) {
      case 'image/jpg':
      case 'image/jpeg':
      case 'image':
        return (
          <div className={classes.card}>
            <img
              src={`https://ipfs.io/ipfs/${hash}`}
              className={classes.media}
              alt={`${title}_img`}
            />
            <AdditionalContentDetails {...this.props} />
          </div>
        );

      case 'video':
        return (
          <div className={classes.video}>
            <video className={classes.media} controls>
              <source src={`https://ipfs.io/ipfs/${hash}`} />
            </video>
            <AdditionalContentDetails {...this.props} />
          </div>
        );

      default:
        return (
          <div className={classes.card}>
            <AdditionalContentDetails {...this.props} />
          </div>
        );
    }
  };

  render() {
    const { classes } = this.props;
    return <div className={classes.container}>{this.renderCard()}</div>;
  }
}

export default injectStyles(styles)(AdditionalContentCard);
