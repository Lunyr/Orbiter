import { getLogger, Raven } from '../lib/logger';
import consumer from './consumer';
import handler from './handler';
import janitor from './janitor';
import settings from '../shared/settings';

const log = getLogger('events');

export const init = () => {
  log.info("Starting up events...");
  /**
   * TODO: Really take a hard look at the choices here.  If this
   *  really makes sense, maybe these should be entirely separate
   *  node processes(fake-threaded like server.js) instead of
   *  using these ugly fake-threads with Promises.
   */
  Promise.race([
    consumer(),
    handler(),
    janitor(),
  ]).then((msg) => {
    log.error({ msg: msg }, "Services exited abnormally!");
  }).catch((err) => {
    log.error({ error: err.message }, "Unhandled error in Services!");
    if (!settings.isDevelopment && typeof process.env.DEBUG === 'undefined') Raven.captureException(err);
    else console.log(err);
  });
};

if (require.main === module) {
  init();
}
