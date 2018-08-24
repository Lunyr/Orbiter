/**
 * This library is for account management
 */

import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import mkdirp from 'mkdirp';
import crypto from 'crypto';
import keythereum from 'keythereum';
import { getLogger } from '../logger';
import { settings } from '../../shared/settings';
import { web3 } from '../../shared/web3';

const log = getLogger("accounts");
const KEY_DIR = process.env.KEY_DIR || path.join(settings.configDir, "keys");
let ACCOUNTS = [];

Promise.promisifyAll(fs);
const mkdirpAsync = Promise.promisify(mkdirp);

/**
 * addHexPrefix will ensure the "0x" prefix exists on a hex string
 * @param {string} str is the hex string to add the prefix to
 * @returns {string} hex string with the 0x prefix
 */
const addHexPrefix = (str) => {
  if (typeof str !== 'string') throw new Error("Provided string not a string");
  if (str.slice(0,2) === "0x") return str;
  return `0x${str}`;
};

/**
 * removeHexPrefix will ensure the "0x" prefix does not exist on a hex string
 * @param {string} str is the hex string to remove the prefix from
 * @returns {string} hex string without the 0x prefix
 */
const removeHexPrefix = (str) => {
  if (typeof str !== 'string') throw new Error("Provided string not a string");
  if (str.slice(0,2) === "0x") return str.slice(2);
  return str;
};

/**
 * getList return an array of objects with the properties `address` and 
 *    `fileName` for each account in the local keystore.
 * @returns {Array} array of objects representing accounts in the keystore
 */
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

/**
 * unlock will decrypt and return the private key for a known account in the
 *    keystore.
 * @param {Object} args is an object with props for function arguments
 * @param {string} args.password is the password used to decrypt the privkey
 * @param {string} args.address the address of the account to unlock
 * @param {string} args.fileName is the file name of the encrtyped secret store
 *    file to decrypt.  Use this OR address, not both.
 * @returns {string} a hex string representation of the private key
 */
export const unlock = async (args) => {
  if (
    typeof args !== 'object'
    || typeof args.password === 'undefined'
    || (typeof args.address === 'undefined' && typeof args.fileName === 'undefined')
  ) {
    throw new Error("Password, and address or fileName required as an object");
  }

  let fileName;
  if (typeof args.address !== 'undefined') {
    // Refresh account list if it's empty
    if (ACCOUNTS.length === 0) await getList();

    // Look for the address in our list of accounts
    const account = _.find(ACCOUNTS, (obj) => { return obj.address === args.address });
    if (!account) {
      log.warn({ address: args.address }, "Unknown account. Can not unlock.");
      return null;
    }
    fileName = account.fileName;
  } else {
    fileName = args.fileName;
  }

  // Load it from the keystore file
  const fileString = await fs.readFileAsync(path.join(KEY_DIR, fileName));
  const keyObj = JSON.parse(fileString);

  // Recover and return the privkey
  const encodedKey = keythereum.recover(args.password, keyObj);
  return addHexPrefix(encodedKey.toString('hex'));
};

/**
 * savePlain will save a "plain" privkey(hex string) to a secret store file
 * @param {string} password is the password used to encrypt the privkey
 * @param {string} rawKey the hex string of the privkey
 * @returns {string} filename of the newly saved secret store file
 */
export const savePlain = async (password, rawKey) => {
  rawKey = removeHexPrefix(rawKey);

  const keyBytes = keythereum.constants.keyBytes;
  const ivBytes = keythereum.constants.ivBytes;
  const rando = crypto.randomBytes(keyBytes + ivBytes + keyBytes);
  const thing = {
    privateKey: rawKey,
    iv: rando.slice(keyBytes, keyBytes + ivBytes),
    salt: rando.slice(keyBytes + ivBytes)
  }
  return await save(password, thing);
};

/**
 * save will save a privkey object to a secret store file
 * @param {string} password is the password used to encrypt the privkey
 * @param {Object} dk is the derived key object
 * @param {Buffer} dk.privateKey is the privkey
 * @param {Buffer} dk.salt is the salt used to encrypt the privkey
 * @param {Buffer} dk.iv initialization vector for encryption
 * @returns {string} filename of the newly saved secret store file
 */
export const save = async (password, dk) => {
  if (
    typeof dk !== 'object'
    || typeof dk.privateKey === 'undefined'
    || typeof dk.salt === 'undefined'
    || typeof dk.iv === 'undefined'
  ) {
    throw new Error("Invalid derived key object");
  }
  const keyObj = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);

  // Verify KEY_DIR exists, if not create it
  if (!fs.existsSync(KEY_DIR)) await mkdirpAsync(KEY_DIR, { mode: 0o750 });
  const dirStats = await fs.statAsync(KEY_DIR);
  if (!dirStats.isDirectory()) throw new Error("Key directory is not a directory!");
  return keythereum.exportToFile(keyObj, KEY_DIR);
};

/**
 * importFromFile will import a privkey from a secret specific store file
 * @param {string} password is the password used to encrypt the privkey
 * @param {string} fileName is the secret store file to import
 * @returns {string} a hex string representation of the private key
 */
export const importFromFile = async (password, fileName) => {
  return await unlock({ password, fileName });
};

/**
 * importFromAPI will verify a user's credentials for lunyr.com and re-gen their
 *    private key for use and storage with Orbiter.
 * @param {string} email is the user's E-mail address used for lunyr.com
 * @param {string} password is their password
 * @returns {string} a hex string representation of the private key
 */
export const importFromAPI = async (email, password) => {
  // Call to API to verify account
  const res = await fetch(settings.lunyrAPIRoot + 'auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password: web3.utils.sha3(password),
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (res.status === 400) {
    const respBody = await res.json();
    throw new Error(respBody.message)
  } else if (res.status !== 200) {
    throw new Error("Unknown error");
  }
  const respBody = await res.json();

  // Private key is derived like so.  Call to API is to verify accuracy
  const privkey = web3.utils.sha3(password + '.' + respBody.account.username);

  // Save the file
  // TODO: Figure out if we want to auto-save here or have the UI/User do the call
  //await savePlain(password, privkey);

  return privkey;
};

/**
 * newKey create a new private key
 * @returns {Object} a derived key object that can be used with save()
 */
export const newKey = () => {
  return keythereum.create();
};
