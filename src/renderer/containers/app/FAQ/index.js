import React from 'react';
import injectStyles from 'react-jss';
import ReactSVG from 'react-svg';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import ReadersImg from '../../../../assets/images/about/readers.svg';
import FaqCollapsible from './FaqCollapsible';

class FAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'general',
      onHover: [false, false, false, false],
    };
  }

  /***
   * sets the active tab by changign the state variable
   *
   */
  setActiveTab = (id) => {
    this.setState({
      activeTab: id,
    });
  };

  onHover = (bool, id) => {
    const onHover = [...this.state.onHover];
    onHover[id] = bool;
    this.setState({
      onHover: onHover,
    });
  };

  render() {
    const { classes, intl } = this.props;
    const tabItems = [
      {
        id: 'general',
        icon: ReadersImg,
        text: intl.formatMessage({
          id: 'faq_general',
          defaultMessage: 'General',
        }),
      },
    ];
    const tabs = tabItems.map((tab, index) => {
      return (
        <div
          className={cx(classes.tab, this.state.activeTab === tab.id && classes.activeTab)}
          onClick={() => this.setActiveTab(tab.id)}
          key={`${tab.id}_${index}`}
          onMouseEnter={() => this.onHover(true, index)}
          onMouseLeave={() => this.onHover(false, index)}>
          <div className={this.state.activeTab === tab.id ? 'activeTab' : null}>
            <ReactSVG
              className={this.state.onHover[index] ? ' hover' : null}
              path={tab.icon}
              style={{ width: '50px', height: '49px' }}
            />
          </div>
          <span
            className={cx(
              classes.tabText,
              this.state.activeTab === tab.id && classes.activeText,
              this.state.onHover[index] && classes.hoverText
            )}>
            {tab.text}
          </span>
        </div>
      );
    });
    const generalItems = [
      {
        title: intl.formatMessage({
          id: 'faq_whatIs_title',
          defaultMessage: 'What is Lunyr?',
        }),
        description: intl.formatMessage({
          id: 'faq_whatIs_description',
          defaultMessage: `
          Lunyr is an Ethereum-based decentralized crowdsourced encyclopedia that rewards users with app tokens
          for peer-reviewing and contributing information. We aim to be the starting point of the internet for finding
          reliable, accurate information. Our long-term vision is to develop a knowledge base API
          that Artificial Intelligence, Virtual Reality, Augmented Reality and other software can
          use to create next generation decentralized applications.`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_whatIsLun_title',
          defaultMessage: 'What are Lunyr tokens (LUN)?',
        }),
        description: intl.formatMessage({
          id: 'faq_whatIsLun_description',
          defaultMessage: `LUN are used to place ads on the platform. They function as part of the
          incentive system to drive contribution and peer review. LUN follow the ERC20 Token Standard.`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_whatIsPronounce_title',
          defaultMessage: 'How do you pronounce Lunyr?',
        }),
        description: intl.formatMessage({
          id: 'faq_whatIsPronounce_description',
          defaultMessage: `Lunyr is pronounced “lunar.”`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_whyUse_title',
          defaultMessage: 'Why would anyone use this platform over alternatives?',
        }),
        description: intl.formatMessage({
          id: 'faq_whyUse_description',
          defaultMessage: `For readers, there will be more valuable, peer-reviewed information that would
          not be available unless experts were rewarded for contributing. For developers, there will
          be an API that can serve as the foundation for new applications.`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_whereIsData_title',
          defaultMessage: 'Where will the data be stored?',
        }),
        description: intl.formatMessage({
          id: 'faq_whereIsData_description',
          defaultMessage: `We will be using IPFS but aim to transition to better solutions once they are ready.`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_maliciousUsers_title',
          defaultMessage: 'What stops users from adding inaccurate or malicious content?',
        }),
        description: intl.formatMessage({
          id: 'faq_maliciousUsers_description',
          defaultMessage: `All submissions go through a mandatory peer review process and are not committed
          to the knowledge base unless approved. Thus spam, fake, or malicious content will be rejected.`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_whoPeerReviews_title',
          defaultMessage: 'Who are the peer reviewers?',
        }),
        description: intl.formatMessage({
          id: 'faq_whoPeerReviews_description',
          defaultMessage: `Users who submit contributions will also be required to peer review other submissions.`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_whoOwnsContent_title',
          defaultMessage: 'Will Lunyr own the content?',
        }),
        description: intl.formatMessage({
          id: 'faq_whoOwnsContent_description',
          defaultMessage: `No, all content may be freely redistributed, reused, and built upon by anyone.`,
        }),
      },
      {
        title: intl.formatMessage({
          id: 'faq_copyright_title',
          defaultMessage: 'How will copyright violations be dealt with?',
        }),
        description: intl.formatMessage({
          id: 'faq_copyright_description',
          defaultMessage: `All submissions must cite their sources so that peer reviewers can inspect and
          validate referenced material. In the event that copyright violations pass through the peer
          review system, they can be re-evaluated in the peer review system with the proper evidence.`,
        }),
      },
    ];
    const general = generalItems.map((faq, index) => {
      return (
        <FaqCollapsible
          title={faq.title}
          description={faq.description}
          key={`${faq.title}_${index}`}
        />
      );
    });
    return (
      <div className={classes.faqPageContainer}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>Faq</span>
        </div>
        <div className={classes.tabContainer}>{tabs}</div>
        <div className={classes.faqBody}>{this.state.activeTab === 'general' && general}</div>
        <div className={classes.faqBodyMobile}>
          <div className={classes.sectionTitle}>General</div>
          {general}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  faqPageContainer: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
  },
  header: {
    height: '339px',
    width: '100%',
    background: 'linear-gradient(137.43deg, #FE7E83 0%, #FF845E 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    textTransform: 'uppercase',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: '70px',
    fontWeight: '300',
  },
  tabContainer: {
    position: 'absolute',
    top: '291px',
    left: '50%',
    transform: 'translate(-50%)',
    display: 'flex',
    justifyContent: 'center',
  },
  tab: {
    width: '291px',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    background: '#fff',
    boxShadow: '0 22px 60px 0 rgba(38, 39, 82, 0.15)',
    borderRadius: '4px',
    boxSizing: 'border-box',
    padding: '30px',
    cursor: 'pointer',
    '&:hover': {
      background: 'linear-gradient(137.43deg, #FE7E83 0%, #FF845E 100%)',
      boxShadow: '10px 10px 60px 10px rgba(38, 39, 82, 0.15)',
    },
  },
  tabText: {
    ...theme.typography.h3,
    color: theme.colors.white,
  },
  activeTab: {
    background: 'linear-gradient(137.43deg, #FE7E83 0%, #FF845E 100%)',
    boxShadow: '10px 10px 60px 10px rgba(38, 39, 82, 0.15)',
  },
  activeText: {
    color: theme.spacing.white,
  },
  hoverText: {
    color: theme.spacing.white,
  },
  faqBody: {
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing * 2,
    paddingTop: theme.spacing * 5,
    paddingRight: 0,
    paddingBottom: theme.spacing * 3,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginTop: theme.spacing * 3,
  },
  faqBodyMobile: {
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing * 2,
    paddingRight: 0,
    paddingBottom: theme.spacing * 3,
  },
});

export default injectIntl(injectStyles(styles)(FAQ));
