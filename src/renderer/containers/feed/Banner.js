import React from 'react';
import { Link } from 'react-router-dom';
import { css, StyleSheet } from 'aphrodite';
import mixpanel from 'mixpanel-browser';
import { FormattedMessage } from 'react-intl';
import Button from '../components/base/buttons/BaseButton';
import ProgressiveImage from '../components/ProgressiveImage';
import theme from '../../theme';

const Banner = ({ createDraft, isLoggedIn }) => (
  <section className={css(styles.banner)}>
    <ProgressiveImage
      src={require('./banner.png')}
      placeholder={require('./banner@1x.png')}
      className={css(styles.image)}
      alt="Call to Action"
    />
    <div className={css(styles.container)}>
      <h1 className={css(styles.title)}>
        <FormattedMessage id="banner_titleStart" defaultMessage="Ethereum-based" />
        <br />
        <FormattedMessage id="banner_titleEnd" defaultMessage="Encyclopedia with Rewards" />
      </h1>
      <p className={css(styles.help)}>
        <FormattedMessage
          id="banner_subtitle"
          defaultMessage="Get Contribution Points for Writing"
        />
      </p>
      {isLoggedIn ? (
        <Button
          styles={{ button: styles.button }}
          value={<FormattedMessage id="banner_cta" defaultMessage="Start Now" />}
          onClick={() => {
            mixpanel.track('banner_button_clicked');
            createDraft();
          }}
        />
      ) : (
        <Link className={css(styles.link)} to="/signup?redirect=write">
          <Button
            styles={{ button: styles.button }}
            value={<FormattedMessage id="banner_cta" defaultMessage="Start Now" />}
            onClick={() => {
              mixpanel.track('banner_button_clicked');
            }}
          />
        </Link>
      )}
    </div>
  </section>
);

const styles = StyleSheet.create({
  banner: {
    position: 'relative',
    height: 425,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    '@media only screen and (max-width: 1024px)': {
      height: 300,
    },
    '@media only screen and (max-width: 768px)': {
      display: 'none',
    },
  },
  link: {
    textDecoration: 'none',
  },
  image: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 0,
    objectFit: 'cover',
  },
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: 2,
    height: 300,
    padding: '20px 100px',
    '@media only screen and (max-width: 1024px)': {
      paddingLeft: theme.spacing * 4,
      paddingRight: theme.spacing * 4,
    },
    '@media only screen and (max-width: 768px)': {
      paddingLeft: theme.spacing,
      paddingRight: theme.spacing,
    },
  },
  title: {
    ...theme.typography.header,
    fontWeight: 'bold',
    fontSize: 54,
    color: theme.colors.white,
    margin: 0,
    lineHeight: '65px',
    '@media only screen and (max-width: 1200px)': {
      fontSize: 34,
      lineHeight: '32px',
    },
  },
  help: {
    ...theme.typography.help,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 34,
    marginTop: theme.spacing * 2,
    marginBottom: theme.spacing * 2,
    lineHeight: '32px',
    '@media only screen and (max-width: 1200px)': {
      fontSize: 24,
      lineHeight: '22px',
    },
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: theme.colors.white,
    fontWeight: 700,
    height: 58,
    width: 225,
    borderRadius: theme.borderRadius,
    border: '2px solid rgba(255, 255, 255, 0.4)',
    fontSize: 24,
    marginTop: theme.spacing * 1.5,
    flexShrink: 0,
    ':hover:not(:disabled)': {
      backgroundColor: 'rgba(255, 255, 255, 0.35)',
    },
    '@media only screen and (max-width: 1080px)': {
      height: 42,
      width: 150,
      fontSize: 18,
      marginTop: theme.spacing,
    },
  },
});

export default Banner;
