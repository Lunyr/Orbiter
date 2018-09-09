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

/*
* Return a number from wei
*/
export const fromWei = (wei) => {
  const value = toBigNumber(wei).dividedBy(ETHER_UNIT);
  return wei.isBigNumber ? value : value.toString(10);
};

/*
* Return usd based on gwei
*/
export const gweiToUsd = (gwei, gas, usdConversion) =>
  parseFloat(fromWei(gwei * 1e9 * gas) * usdConversion).toFixed(2);

/*
* Return lunyr to usd conversion
*/
export const lunyrConversion = (lunyrTokens) => {
  return parseFloat((lunyrTokens / 1e18) * 1.0).toFixed(5);
};

/*
* Return an ethereum conversion from usd.
*/
export const usdToEth = (usd, usdConversion) =>
  (parseFloat(usd) / parseFloat(usdConversion).toFixed(2)).toFixed(5);

/*
* Return a normalized balance
*/
export const normalizeBalance = (balance) => (balance / 1.0).toFixed(5);

/*
* Returns a normalize Gwei
 */
export const normalizeGwei = (gwei) => gwei.toFixed(5);

/*
* Returns a promise that resolves of the reader array buffer
 */
export const readUploadedFileAsBuffer = (inputFile) => {
  const temporaryFileReader = new window.FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new window.DOMException('Problem parsing input file.'));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsArrayBuffer(inputFile);
  });
};
