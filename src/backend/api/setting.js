import { db } from '../db';
import { getLogger } from '../../lib/logger';
import { web3 } from '../../shared/web3';

const log = getLogger('api-setting');

export const getUserSettings = async (address) => {
  try {
    const result = await db('setting').where({
      hashed_address: web3.utils.sha3(address),
    });

    log.debug({ result }, "getUserSettings result");

    const data = result.reduce((acc, setting) => {
      acc.push({
        name: setting.name,
        value: setting.value,
      });
      return acc;
    }, []);

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

export const setUserSetting = async (address, name, value) => {
  try {
    let data;
    const check = await db('setting').where({
      hashed_address: web3.utils.sha3(address),
      name
    });

    if (check.length > 0) {
      const updateResult = await db('setting')
        .where({
          hashed_address: web3.utils.sha3(address),
          name
        }).update({
          value
        });
      if (updateResult < 1) {
        throw new Error("Attempt to update setting that doesn't exist");
      } else {
        data = updateResult;
      }
    } else {
      const insertResult = await db('setting')
        .insert({
          hashed_address: web3.utils.sha3(address),
          name,
          value
        });
      if (insertResult.length < 1 || insertResult[0] < 1) {
        throw new Error("Attempt to insert setting seems to have failed");
      } else {
        data = insertResult[0];
      }
    }

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