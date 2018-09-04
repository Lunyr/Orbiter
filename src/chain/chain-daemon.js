import { getLogger } from '../lib/logger';
import eventsQueue from '../lib/queuelite';
import { handleError } from '../shared/handlers';
import consumer from './consumer';
import handler from './handler';
import janitor from './janitor';
import sweeper from './sweeper';

const log = getLogger('events');

export const init = () => {
  log.info('Starting up events...');
  const queue = eventsQueue('event_queue');
  /**
   * TODO: Really take a hard look at the choices here.  If this
   *  really makes sense, maybe these should be entirely separate
   *  node processes(fake-threaded like server.js) instead of
   *  using these ugly fake-threads with Promises.
   */
  Promise.race([consumer(queue), handler(queue), janitor(), sweeper()])
    .then((msg) => {
      log.error({ msg: msg }, 'Services exited abnormally!');
    })
    .catch((err) => {
      log.error({ error: err.message }, 'Unhandled error in Services!');
      handleError(err);
    });
};

if (require.main === module) {
  init();
}
