import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { DiscordIcon, TelegramIcon } from '../../components/icons';

import {
  FaFacebook as FacebookIcon,
  FaMedium as MediumIcon,
  FaReddit as RedditIcon,
  FaTwitter as TwitterIcon,
} from 'react-icons/fa';

const FooterLink = ({ className, href, children }) => (
  <a className={className} target="_blank" rel="noopener noreferrer" href={href}>
    {children}
  </a>
);

const Footer = ({ classes }) => (
  <footer className={classes.container}>
    <ul className={classes.list}>
      <li className={classes.item}>
        <FooterLink className={classes.link} href="https://twitter.com/LunyrInc">
          <TwitterIcon className={classes.icon} size={20} />
        </FooterLink>
      </li>
      <li className={classes.item}>
        <FooterLink className={classes.link} href="https://www.reddit.com/r/Lunyr/">
          <RedditIcon className={classes.icon} size={20} />
        </FooterLink>
      </li>
      <li className={classes.item}>
        <FooterLink className={classes.link} href="https://discord.gg/Vaw5MWD">
          <DiscordIcon className={classes.icon} size={20} />
        </FooterLink>
      </li>
      <li className={classes.item}>
        <FooterLink className={classes.link} href="https://t.me/lunyrcommunity">
          <TelegramIcon className={classes.icon} size={20} />
        </FooterLink>
      </li>
      <li className={classes.item}>
        <FooterLink className={classes.link} href="https://medium.com/lunyr">
          <MediumIcon className={classes.icon} size={20} />
        </FooterLink>
      </li>
      <li className={classes.item}>
        <FooterLink className={classes.link} href="https://www.facebook.com/lunyrinc/">
          <FacebookIcon className={classes.icon} size={20} />
        </FooterLink>
      </li>
    </ul>
    <div className={classes.license}>
      <FormattedMessage id="footer_textAvailable" defaultMessage="Text is available under the" />
      <a
        href="https://creativecommons.org/licenses/by-sa/3.0/us/legalcode"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.license__link}>
        {' '}
        Creative Commons Attribution-ShareAlike 3.0 License.
      </a>
    </div>
  </footer>
);

const styles = (theme) => ({
  container: ({ height }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    height,
    backgroundColor: theme.colors.lightGray,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  }),
  license: {
    opacity: 0.7,
    marginBottom: 3,
    fontSize: '0.75rem',
  },
  license__link: {
    marginLeft: 3,
    marginRight: 3,
  },
  list: {
    display: 'inline-flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexShrink: 1,
    width: '100%',
    justifyContent: 'center',
  },
  item: {
    marginLeft: theme.spacing * 1.25,
    marginRight: theme.spacing * 1.25,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBDCE1',
    height: 34,
    width: 34,
    borderRadius: '50%',
  },
  icon: {
    color: theme.colors.white,
  },
  hidden: {
    display: 'none',
  },
});

export default injectStyles(styles)(Footer);
