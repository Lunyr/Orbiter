import { db } from '../db';
import settings from '../../shared/settings';
import { web3 } from '../../shared/web3';

export const addNotification = async (address, type, dataObj) => {
  try {
    const data = await db('notification').insert({
      hashed_address: web3.utils.sha3(address),
      type,
      data: JSON.stringify(dataObj)
    });
    console.log("addNotification insert result", data);
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
    const data = await db('notification').where({
      hashed_address: web3.utils.sha3(address),
    }).select();
    console.log("getNotifications select result", data);
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

export const markRead = async (notification_id) => {
  try {
    const data = await db('notification').where({
      notification_id
    }).update({
      read: true
    });
    console.log("markRead update result", data);
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
