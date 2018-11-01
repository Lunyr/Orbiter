import { ipcRenderer } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { IconButton, ProgressBar } from '../../../components';
import { MdClose as CloseIcon } from 'react-icons/md';
import { DiscordIcon, TelegramIcon } from '../../../components/icons';
import { updateQueueStatus, setQueueSyncing } from '../../../../shared/redux/modules/app/actions';
import styles from './styles';
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

const SyncProgressBar = ({ classes, progress = 0, remaining }) => (
  <ProgressBar.Line
    progress={progress}
    text={`Syncing with Blockchain ${(progress * 100).toFixed(2)}% (${
      remaining === null ? 'Please wait...establishing sync queue...' : `Remaining: ${remaining}`
    })`}
    options={{
      strokeWidth: 4,
      color: 'rgb(255, 132, 94)',
      trailColor: '#CCCCCC',
      trailWidth: 3,
      svgStyle: {
        width: '100%',
        height: 25,
        borderRadius: 6,
      },
      text: {
        style: {
          color: '#333333',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
          height: '100%',
          width: '100%',
          transform: null,
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '0.65rem',
        },
      },
    }}
    initialAnimate={true}
    containerClassName={classes.progress}
  />
);

class Footer extends React.PureComponent {
  statusIntervals = {
    progress: 3000, // ping every 3 seconds while in progress to get a smoother update on progress bar
    ping: 60000, // ping every 60 seconds by default
  };

  turnSyncOff = () => {
    const { setQueueSyncing } = this.props;
    setQueueSyncing(false, this.statusIntervals.ping);
    toast.info(
      'Orbiter sync was manually stopped. You may experience data issues if you do not fully sync with the blockchain.'
    );
  };

  checkChangeIntervalPolling = () => {
    const { progress, setQueueSyncing, syncing, pollIntervalMS, remaining } = this.props;
    // Not showing sync but the percent complete is not 100
    if (
      // Percent complete came back as null
      remaining === null ||
      // Not syncing and progress is incomplete
      (progress !== 1 && !syncing) ||
      // Syncing but not polling fast enough
      (progress !== 1 && syncing && pollIntervalMS !== this.statusIntervals.progress)
    ) {
      setQueueSyncing(true, this.statusIntervals.progress);
    } else if (progress === 1 && syncing) {
      setQueueSyncing(false, this.statusIntervals.ping);
      new Notification('Finished Sync', {
        body: 'Orbiter has synced with the blockchain.',
      });
    }
  };

  componentWillUnmount() {
    // Destory any generate listeners
    ipcRenderer.removeAllListeners('spawn-queue-status-listener');
    ipcRenderer.removeAllListeners('change-queue-status-interval');
  }

  componentDidUpdate({ pollIntervalMS }) {
    // Update queue interval timer
    if (this.props.pollIntervalMS !== pollIntervalMS) {
      ipcRenderer.send('change-queue-status-interval', this.props.pollIntervalMS);
    }
  }

  componentDidMount() {
    // Send listener start event
    ipcRenderer.send('spawn-queue-status-listener', this.props.pollIntervalMS);

    // Start capturing all the events coming in
    ipcRenderer.on('queue-status-data', (event, status) => {
      try {
        console.info(`=== Chain sync status: ${status}`);
        const parsedStatus = JSON.parse(status);
        this.props.updateQueueStatus(parsedStatus);
        this.checkChangeIntervalPolling(parsedStatus);
      } catch (err) {
        console.error(err);
      }
    });
  }

  render() {
    const { classes, progress, remaining, syncing } = this.props;
    return (
      <footer className={classes.container}>
        {syncing ? (
          <div className={classes.syncbar}>
            <SyncProgressBar classes={classes} progress={progress} remaining={remaining} />
            <IconButton
              aria-label="cancel"
              className={classes.cancel}
              type="button"
              onClick={this.turnSyncOff}
              icon={<CloseIcon size={20} />}
            />
          </div>
        ) : (
          <React.Fragment>
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
              <FormattedMessage
                id="footer_textAvailable"
                defaultMessage="Text is available under the"
              />
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/us/legalcode"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.license__link}>
                {' '}
                Creative Commons Attribution-ShareAlike 3.0 License.
              </a>
            </div>
          </React.Fragment>
        )}
      </footer>
    );
  }
}

const mapStateToProps = ({ app: { queue } }) => {
  const { total = 0, complete = 0, percentComplete, ...rest } = queue;
  return {
    ...rest,
    progress: total === 0 ? 0 : complete / total,
    remaining: percentComplete !== null ? total - complete : null,
  };
};

const mapDispatchToProps = {
  updateQueueStatus,
  setQueueSyncing,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStyles(styles)(Footer));
