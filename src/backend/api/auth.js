import Web3 from 'web3';
import fetch from 'node-fetch';
import { getLogger } from '../../lib/logger';
import { default as settings } from '../../shared/defaults';

const log = getLogger('api-authenticate');

export const authenticate = async (email, password) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: Web3.utils.sha3(password),
      }),
    };
    const result = await fetch(`${settings.lunyrAPIRoot}auth/login`, options);

    if (!result) {
      return {
        success: false,
        username: null,
      };
    }

    const data = await result.json();

    log.debug({ username: data.account.username }, 'Authenticated user to Lunyr API');

    return {
      success: true,
      username: data.account.username,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      username: null,
    };
  }
};
