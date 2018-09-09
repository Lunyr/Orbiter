import moment from 'moment';
import { BigNumber } from 'bignumber.js';

/*
* Utility namespace for common formatting functions
*/

export const cleanUnderscores = (title) => title && title.replace(new RegExp('_', 'g'), ' ');

export const formatDisplayDate = (date) => moment(date).format('MMM Do YYYY');

export const formatDisplayDateLong = (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a');

export const timeAgoDisplay = (date) => moment(date).fromNow();

export const parseIntWithRadix = (value) => parseInt(value, 10);

// Ethereum based utils

export const ETHER_UNIT = '1000000000000000000'; // the unit to divide by in fromWei

export const toBigNumber = (number = 0) => {
  if (number.isBigNumber) {
    return number;
  }
  if (
    (typeof number === 'string' || number instanceof String) &&
    (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)
  ) {
    return new BigNumber(number.replace('0x', ''), 16);
  }
  return new BigNumber(number.toString(10), 10);
};

export const fromWei = (wei) => {
  const value = toBigNumber(wei).dividedBy(ETHER_UNIT);
  return wei.isBigNumber ? value : value.toString(10);
};

export const lunyrConversion = (lunyrTokens) => {
  return ((lunyrTokens / 1e18) * 1.0).toFixed(5);
};
