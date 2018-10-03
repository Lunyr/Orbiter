import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';

class AtoZSection extends React.Component {
  node = undefined;

  letters = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');

  nodeId = (selected) => {
    return `atoz_${selected}`;
  };

  scrollIntoView = ({ selected }) => {
    if (selected && this.node) {
      const el = this.node.querySelector(`#${this.nodeId(selected)}`);
      if (el) {
        // align to top of container
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  componentDidMount() {
    this.scrollIntoView(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.fetching && this.props.fetching) {
      this.scrollIntoView(newProps);
    }
  }

  render() {
    const { classes, onClick, selected } = this.props;
    return (
      <div ref={(node) => (this.node = node)} className={classes.atoz}>
        {this.letters.map((letter) => (
          <div
            id={`atoz_${letter}`}
            key={letter}
            className={cx({
              [classes.atoz__item]: true,
              [classes.atoz__selected]: selected === letter,
            })}
            onClick={onClick.bind(this, letter)}>
            {letter}
          </div>
        ))}
      </div>
    );
  }
}

const styles = (theme) => ({
  atoz: {
    display: 'inline-flex',
    flexDirection: 'column',
    height: 'calc(100vh - 265px)',
    width: 80,
    overflow: 'hidden',
    alignItems: 'center',
    color: theme.colors.darkerGray,
    paddingTop: theme.spacing,
    paddingBottom: theme.spacing,
    borderRight: '1px solid rgba(0,0,0,0.1)',
    '&:hover': {
      overflow: 'scroll',
    },
  },
  atoz__item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    height: 40,
    fontSize: '0.85rem',
    transition:
      'box-shadow 0.3s ease-in, background 0.3s ease-in, height 0.2s ease-in, font-size 0.2s ease-in',
    textTransform: 'uppercase',
    cursor: 'pointer',
    color: theme.colors.darkerGray,
    background: 'transparent',
    fontWeight: 400,
    width: 40,
    borderRadius: 100,
    marginBottom: theme.spacing * 0.75,
    '&:hover': {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: theme.colors.darkerGray,
    },
  },
  atoz__selected: {
    fontSize: '1rem',
    background: theme.colors.darkerGray,
    color: theme.colors.white,
    boxShadow: theme.boxShadows.medium,
    fontWeight: 600,
    '&:hover': {
      fontSize: '1rem',
      background: theme.gradients.darkerGray,
      color: theme.colors.white,
      fontWeight: 600,
    },
  },
});

export default injectStyles(styles)(AtoZSection);
