import { db } from '../db';
import settings from '../../shared/settings';
import { web3 } from '../../shared/web3';
import { getLogger } from '../../lib/logger';
import { toNotification, fromNotification } from '../assemblers';

const log = getLogger('api-notification');

export const addNotification = async (address, type, dataObj) => {
  try {
    dataObj = fromNotification(dataObj);
    const data = await db('notification').insert({
      hashed_address: web3.utils.sha3(address),
      type,
      data: JSON.stringify(dataObj)
    });
    log.debug({ data }, "addNotification result");
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

export const getNotifications = async (address) => {
  try {
    const result = await db('notification').where({
      hashed_address: web3.utils.sha3(address),
    }).select();

    log.debug({ result }, "getNotifications result");

    const data = result.map(n => toNotification(n));

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

export const getUnread = async (address) => {
  try {
    const result = await db('notification').where({
      hashed_address: web3.utils.sha3(address),
      read: false,
    }).select();

    log.debug({ result }, "getNotifications result");

    const data = result.map(n => toNotification(n));

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

export const markRead = async (notificationId) => {
  try {
    const data = await db('notification').where({
      notification_id: notificationId
    }).update({
      read: true
    });
    log.debug({ data }, "markRead result");
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
