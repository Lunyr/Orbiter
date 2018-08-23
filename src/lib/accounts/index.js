/**
 * This library is for account management
 */

import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import keythereum from 'keythereum';
import { getLogger } from '../logger';
import settings from '../../shared/settings';

const log = getLogger("accounts");
const KEY_DIR = process.env.KEY_DIR || path.join(settings.configDir, "keys");
let ACCOUNTS = [];

Promise.promisifyAll(fs);

const addHexPrefix = (str) => {
  if (typeof str !== 'string') throw new Error("Provided string not a string");
  if (str.slice(0,2) === "0x") return str;
  return `0x${str}`;
}

export const getList = async () => {
  // Reset our internal ACCOUNTS list
  if (ACCOUNTS.length > 0) ACCOUNTS = [];

  // Get all files in the key dir
  const files = await fs.readdirAsync(KEY_DIR, {});

  // Read each file and pull out the address
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const fullFileName = path.join(KEY_DIR, fileName);
    const fd = await fs.openAsync(fullFileName, "r");
    if (fs.statSync(fullFileName).isDirectory()) continue;
    const jsonString = await fs.readFileSync(fd);
    try {
      const jsonObj = JSON.parse(jsonString);
      ACCOUNTS.push({ fileName, address: jsonObj.address });
    } catch (err) {
      log.warn({ fileName }, "Unable to read file in key directory");
    }
  }
  return ACCOUNTS;
};

export const unlock = async (address, password) => {
  // Refresh account list if it's empty
  if (ACCOUNTS.length === 0) await getList();

  // Look for the address in our list of accounts
  const account = _.find(ACCOUNTS, (obj) => { return obj.address === address });
  if (!account) {
    log.warn({ address }, "Unknown account. Can not unlock.");
    return null;
  }

  // Load it from the keystore file
  const fileString = await fs.readFileAsync(path.join(KEY_DIR, account.fileName));
  const keyObj = JSON.parse(fileString);

  // Recover and return the privkey
  const encodedKey = keythereum.recover(password, keyObj);
  return addHexPrefix(encodedKey.toString('hex'));
};

export const save = async (password, dk) => {
  if (
    typeof dk !== 'object'
    || typeof dk.privateKey === 'undefined'
    || typeof dk.salt === 'undefined'
    || typeof dk.iv === 'undefined'
  ) {
    throw new Error("Invalid keypair object");
  }
  const keyObj = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);

  // Verify KEY_DIR exists, if not create it
  if (!fs.existsSync(KEY_DIR)) await fs.mkdirAsync(KEY_DIR, 0o750);
  const dirStats = await fs.statAsync(KEY_DIR);
  if (!dirStats.isDirectory()) throw new Error("Key directory is not a directory!");
  return keythereum.exportToFile(keyObj, KEY_DIR);
};

export const newKey = () => {
  return keythereum.create();
};
