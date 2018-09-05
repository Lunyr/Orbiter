import React from 'react';
import injectStyles from 'react-jss';
import { fadeIn } from 'react-animations';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import readersIcon from '../../../assets/images/about/readers.svg';
import contributorsIcon from '../../../assets/images/about/contributors.svg';
import reviewersIcon from '../../../assets/images/about/reviewers.svg';
import guideImg from '../../../assets/images/about/guide.png';
import gifOne from '../../../assets/images/about/gifs/one.gif';
import gifTwo from '../../../assets/images/about/gifs/two.gif';
import gifThree from '../../../assets/images/about/gifs/three.gif';
import gifFour from '../../../assets/images/about/gifs/four.gif';
import gifFive from '../../../assets/images/about/gifs/five.gif';

class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeGif: 'one',
    };
  }

  setActive = (id) => {
    this.setState({
      activeGif: id,
    });
  };

  render() {
    const { classes, intl } = this.props;
    const aboutSlides = [
      {
        id: 'one',
        gif: gifOne,
        title: intl.formatMessage({ id: 'about_slideone_title', defaultMessage: 'Lunyr Platform' }),
        description: intl.formatMessage({
          id: 'about_slideone_description',
          defaultMessage:
            'Lunyr platform is based on constant collaboration of contributors and reviewers who are financially rewarded for their effort. It provides free, peer reviewed information for all users',
        }),
      },
      {
        id: 'two',
        gif: gifTwo,
        title: intl.formatMessage({ id: 'about_slidetwo_title', defaultMessage: 'Contributing' }),
        description: intl.formatMessage({
          id: 'about_slidetwo_description',
          defaultMessage:
            "Whether you're into medicine, art, or finance, Lunyr is the perfect platform to share your knowledge. At Lunyr, we appreciate your knowledge. We will review it, share it with the world, and reward you for that.",
        }),
      },
      {
        id: 'three',
        gif: gifThree,
        title: intl.formatMessage({ id: 'about_slidethree_title', defaultMessage: 'Reviewing' }),
        description: intl.formatMessage({
          id: 'about_slidethree_description',
          defaultMessage:
            'After an article is submitted it will go through our peer review system. Professionals from the field will go through the article focusing on certain points that are essential for high quality articles. Reviewers are rewarded for their work and the useful feedback they send to contributors.',
        }),
      },
      {
        id: 'four',
        gif: gifFour,
        title: intl.formatMessage({
          id: 'about_slidefour_title',
          defaultMessage: 'Peer Review System',
        }),
        description: intl.formatMessage({
          id: 'about_slidefour_description',
          defaultMessage:
            'Each article has to get 2 good reviews or above in order to get published. If it gets 2 or more bad reviews it will be rejected. In both cases reviews are sent to the Contributor so improvements can be made.',
        }),
      },
      {
        id: 'five',
        gif: gifFive,
        title: intl.formatMessage({
          id: 'about_slidefive_title',
          defaultMessage: 'Building Blocks',
        }),
        description: intl.formatMessage({
          id: 'about_slidefive_description',
          defaultMessage:
            "Lunyr is built by people around the world sharing, contributing, and reviewing knowledge. Each article is a small building block in creating the world's largest peer reviewed knowledge base.",
        }),
      },
    ];
    const gifs = aboutSlides.map((gif, index) => {
      return (
        <div
          className={cx(
            classes.howItWorksContainer,
            this.state.activeGif === gif.id && classes.activeGif
          )}
          key={`${gif.title}_${index}`}>
          <div className={classes.gifContainer}>
            {this.state.activeGif === gif.id ? (
              <img className={classes.howItWorksImg} src={gif.gif} alt={gif.title} />
            ) : (
              <img className={classes.howItWorksImg} src={null} alt={gif.title} />
            )}
            <div className={classes.tabContainer}>
              <div
                className={cx(classes.tab, this.state.activeGif === 'one' && classes.activeTab)}
                onClick={() => this.setActive('one')}
                style={{ opacity: 0.3 }}>
                <span className={classes.tab__index}>
                  <FormattedMessage id="about_slideone_number" defaultMessage="1" />
                </span>
              </div>
              <div
                className={cx(classes.tab, this.state.activeGif === 'two' && classes.activeTab)}
                onClick={() => this.setActive('two')}
                style={{ opacity: 0.4 }}>
                <span className={classes.tab__index}>
                  <FormattedMessage id="about_slidetwo_number" defaultMessage="2" />
                </span>
              </div>
              <div
                className={cx(classes.tab, this.state.activeGif === 'three' && classes.activeTab)}
                onClick={() => this.setActive('three')}
                style={{ opacity: 0.5 }}>
                <span className={classes.tab__index}>
                  <FormattedMessage id="about_slidethree_number" defaultMessage="3" />
                </span>
              </div>
              <div
                className={cx(classes.tab, this.state.activeGif === 'four' && classes.activeTab)}
                onClick={() => this.setActive('four')}
                style={{ opacity: 0.6 }}>
                <span className={classes.tab__index}>
                  <FormattedMessage id="about_slidefour_number" defaultMessage="4" />
                </span>
              </div>
              <div
                className={cx(classes.tab, this.state.activeGif === 'five' && classes.activeTab)}
                onClick={() => this.setActive('five')}
                style={{ opacity: 0.7 }}>
                <span className={classes.tab__index}>
                  <FormattedMessage id="about_slidefive_number" defaultMessage="5" />
                </span>
              </div>
            </div>
          </div>
          <div className={classes.howItWorksDescriptionContainer}>
            <span className={cx(classes.sectionTitle, classes.howItWorks)}>
              <FormattedMessage id="about_howItWorks" defaultMessage="How it works" />
            </span>
            <div className={classes.howItWorksDescription}>
              <span className={classes.lunyrTitle}>{gif.title}</span>
              <span className={cx(classes.description, classes.fadeIn)}>{gif.description}</span>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className={classes.aboutContainer}>
        {gifs}
        <div className={classes.useDescriptionContainer}>
          <span className={cx(classes.sectionTitle, classes.useTitle)}>
            <FormattedMessage id="about_whoWillUseIt" defaultMessage="Who will use it?" />
          </span>
          <span className={classes.description}>
            <FormattedMessage
              id="about_whoWillUseItDescription"
              defaultMessage="Everyone will be able to get free and reliable information on Lunyr. So whether you're a
            contributor, reviewer, or reader you'll be able to enjoy features & perks of Lunyr."
            />
          </span>
        </div>
        <div className={classes.useGraphicContainer}>
          <div className={classes.cardContainer}>
            <img className={classes.icon} src={readersIcon} alt="Readers" />
            <div className={classes.cardText}>
              <span className={classes.cardTitle}>
                <FormattedMessage id="about_readers" defaultMessage="Readers" />
              </span>
              <hr className={classes.cardDivider} />
              <span className={classes.cardDescription}>
                <FormattedMessage
                  id="about_readers_description"
                  defaultMessage="Providing reliable, free and peer reviewed information that can be used for anything"
                />
              </span>
            </div>
          </div>
          <div className={classes.cardContainer}>
            <img className={classes.icon} src={contributorsIcon} alt="Contributors" />
            <div className={classes.cardText}>
              <span className={classes.cardTitle}>
                <FormattedMessage id="about_contributors" defaultMessage="Contributors" />
              </span>
              <hr className={classes.cardDivider} />
              <span className={classes.cardDescription}>
                <FormattedMessage
                  id="about_contributors_description"
                  defaultMessage="People that are building pillars of decentralized knowledge base on Lunyr platform"
                />
              </span>
            </div>
          </div>
          <div className={classes.cardContainer}>
            <img className={classes.icon} src={reviewersIcon} alt="Reviewers" />
            <div className={classes.cardText}>
              <span className={classes.cardTitle}>
                <FormattedMessage id="about_reviewers" defaultMessage="Reviewers" />
              </span>
              <hr className={classes.cardDivider} />
              <span className={classes.cardDescription}>
                <FormattedMessage
                  id="about_reviewers_description"
                  defaultMessage="Making information accurate and trustworthy is what Lunyr is all about"
                />
              </span>
            </div>
          </div>
        </div>
        <div className={classes.guideContainer}>
          <img className={classes.guideImg} src={guideImg} alt="Guide" />
          <div className={classes.guideDescriptionContainer}>
            <span className={classes.sectionTitle}>
              <FormattedMessage id="about_greatArticles" defaultMessage="Guide to Great Articles" />
            </span>
            <div className={classes.bulletPointContainer}>
              <div className="bulletPointIconContainer">
                <i className={classes.bulletPointIcon + ' fa fa-circle'} aria-hidden="true" />
              </div>
              <div className={classes.bulletPoint}>
                <span className={classes.bulletTitle}>
                  <FormattedMessage id="about_research" defaultMessage="Research and Accuracy" />
                </span>
                <span className={classes.bulletDescription}>
                  <FormattedMessage
                    id="about_research_description"
                    defaultMessage="Your article will be rated on its general impression, accuracy, grammar, and other
                  basis. Thorough research and professional writing will get you to the featured
                  articles list."
                  />
                </span>
              </div>
            </div>
            <div className={classes.bulletPointContainer}>
              <div className="bulletPointIconContainer">
                <i className={classes.bulletPointIcon + ' fa fa-circle'} aria-hidden="true" />
              </div>
              <div className={classes.bulletPoint}>
                <span className={classes.bulletTitle}>
                  <FormattedMessage id="about_references" defaultMessage="Backed with References" />
                </span>
                <span className={classes.bulletDescription}>
                  <FormattedMessage
                    id="about_references_description"
                    defaultMessage="Back up your information with appropriate references and sources."
                  />
                </span>
              </div>
            </div>
            <div className={classes.bulletPointContainer}>
              <div className="bulletPointIconContainer">
                <i className={classes.bulletPointIcon + ' fa fa-circle'} aria-hidden="true" />
              </div>
              <div className={classes.bulletPoint}>
                <span className={classes.bulletTitle}>
                  <FormattedMessage
                    id="about_linksAndMedia"
                    defaultMessage="Backed with References"
                  />
                </span>
                <span className={classes.bulletDescription}>
                  <FormattedMessage
                    id="about_linksAndMedia_description"
                    defaultMessage="Enable readers to immerse in a full experience of the topic you're covering by providing them with relevant links and media."
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  aboutContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    maxWidth: '1590px',
    padding: theme.spacing,
    overflow: 'auto',
    backgroundColor: theme.colors.white,
  },
  howItWorksContainer: {
    width: '100%',
    display: 'none',
    boxSizing: 'border-box',
    padding: '0 100px',
    flexDirection: 'column',
    flexShrink: 0,
  },
  howItWorksDescriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  howItWorksDescription: {
    display: 'flex',
    flexDirection: 'column',
  },
  howItWorks: {
    opacity: 0.4,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing,
  },
  lunyrTitle: {
    ...theme.typography.h4,
  },
  description: {
    ...theme.typography.body,
  },
  useDescriptionContainer: {
    width: 422,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    justifyContent: 'center',
    margin: `${theme.spacing * 4}px auto`,
    height: 225,
    flexShrink: 0,
  },
  useGraphicContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: theme.spacing * 4,
    alignItems: 'center',
    flexShrink: 0,
    height: 'auto',
  },
  cardContainer: {
    height: 380,
    width: 330,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    boxShadow: '0 22px 60px 0 rgba(38,39,82,0.15)',
    display: 'flex',
    flexDirection: 'column',
    padding: '70px 42px 0',
    boxSizing: 'border-box',
    marginBottom: theme.spacing,
  },
  cardTitle: {
    ...theme.typography.h2,
  },
  cardDescription: {
    ...theme.typography.body,
  },
  icon: {
    width: 'fit-content',
    paddingBottom: '35px',
  },
  guideContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexShrink: 0,
    alignItems: 'center',
    width: '100%',
  },
  guideDescriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  bulletPoint: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '50px',
    width: '250px',
    paddingLeft: '20px',
  },
  bulletTitle: {
    color: '#494D5F',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontWeight: '500',
  },
  bulletDescription: {
    opacity: '0.6',
    color: '#494D5F',
    fontFamily: 'Roboto',
    fontSize: '14px',
    lineHeight: '22px',
    paddingTop: '4px',
  },
  useTitle: {
    marginBottom: '8%',
  },
  cardText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  cardDivider: {
    width: '15%',
    color: '#E8E8E8',
    margin: '10px 0px',
  },
  bulletPointContainer: {
    display: 'flex',
    '&:after': {
      content: "''",
      height: '100%',
    },
  },
  bulletPointIcon: {
    fontSize: 1,
    color: theme.colors.primary,
    border: '2px solid',
    borderColor: theme.colors.primary,
    borderRadius: '50%',
    marginLeft: theme.spacing,
  },
  howItWorksImg: {},
  guideImg: {
    maxWidth: '350px',
  },
  activeGif: {
    display: 'flex',
  },
  tabContainer: {
    width: '200px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing,
    marginBottom: theme.spacing,
  },
  tab: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    ...theme.typography.body,
    color: theme.colors.blue,
    background: theme.colors.white,
    borderRadius: '100%',
    height: '38px',
    width: '38px',
  },
  tab__index: {},
  activeTab: {
    boxShadow: '0 9px 16px 0 rgba(51, 54, 86, 0.2)',
    opacity: 1,
  },
  gifContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s',
  },
});

export default injectIntl(injectStyles(styles)(About));
