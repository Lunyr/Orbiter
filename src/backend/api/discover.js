import multihashes from 'multihashes';
import { db } from '../db';
import { getLogger } from '../../lib/logger';
import { ipfsFetch } from '../../chain/utils';
import { initRouter } from '../../shared/contracts';

const log = getLogger('api-discover');

export const getDiscover = async () => {
  try {
    const router = await initRouter();
    const result = await router.methods.getAsset('discover').call();
    const qmHash = multihashes.toB58String(multihashes.fromHexString(`1220${result.slice(2)}`));
    const data = await ipfsFetch(qmHash);

    log.debug({ data }, "Fetched discover JSON");

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
