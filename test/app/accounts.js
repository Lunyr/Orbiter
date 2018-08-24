const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Promise = require('bluebird');
const assert = require('chai').assert;
const accountManager = require('../../build/lib/accounts');

Promise.promisifyAll(fs);

const PASSWORD = 'lunyrRocks';
const TEST_EMAIL = 'testman@lunyr.com';
const TEST_PASSWORD = 'asdfjkl;';

describe('Account management', () => {
  it('should create a new key', async () => {
    const dk = accountManager.newKey();
    assert.isTrue(dk.privateKey instanceof Buffer);
    assert.isTrue(dk.iv instanceof Buffer);
    assert.isTrue(dk.salt instanceof Buffer);
  });

  it('should save a keypair', async () => {
    const dk = accountManager.newKey();
    const fileName = await accountManager.save(PASSWORD, dk);
    assert.isAbove(fileName.length, 0, "Filename not returned by save()");

    // Make sure it's a file that exists
    const keystoreStats = await fs.statAsync(fileName);
    assert.isTrue(keystoreStats.isFile(), "Filename is not a file");

    const keystore = await fs.openAsync(fileName, 'r');
    const keystoreString = await fs.readFileSync(keystore);
    const keystoreObj = JSON.parse(keystoreString);
    assert.equal(keystoreObj.address.length, 40, "Address does not exist")
  });

  it('should save a raw key', async () => {
    const rawKey = crypto.randomBytes(32);
    const fileName = await accountManager.savePlain(PASSWORD, rawKey);

    // Make sure it's a file that exists
    const keystoreStats = await fs.statAsync(fileName);
    assert.isTrue(keystoreStats.isFile(), "Filename is not a file");

    const keystore = await fs.openAsync(fileName, 'r');
    const keystoreString = await fs.readFileSync(keystore);
    const keystoreObj = JSON.parse(keystoreString);
    assert.equal(keystoreObj.address.length, 40, "Address does not exist")

    // Load and unlock
    const privkey = await accountManager.unlock({ address: keystoreObj.address, password: PASSWORD });
    assert.equal(privkey.length, 66, "Private key not provided");
    assert.equal(privkey, '0x' + rawKey.toString('hex'), "Private key not the same as the original");
  });

  it('should get a list of accounts', async () => {
    const accountsList = await accountManager.getList();
    assert.equal(typeof accountsList, 'object');
    assert.isTrue(accountsList instanceof Array);
    assert.isAbove(accountsList.length, 0);
    accountsList.forEach((acct) => {
      assert.equal(typeof acct, 'object');
      assert.equal(typeof acct.fileName, 'string');
      assert.isAbove(acct.fileName.length, 0);
      assert.equal(typeof acct.address, 'string');
      assert.equal(acct.address.length, 40);
    });
  });

  it('should unlock an account', async () => {
    const accountsList = await accountManager.getList();
    assert.isAbove(accountsList.length, 0, "No accounts to test");
    const account = accountsList[0];

    // Unlock the account
    const privkey = await accountManager.unlock({ address: account.address, password: PASSWORD });
    assert.equal(privkey.slice(0,2), '0x', 'Private key is missing the 0x prefix');
    assert.equal(privkey.length, 66, 'Private key is the wrong length');
  });

  it('should import an account from a file', async () => {
    const accountsList = await accountManager.getList();
    assert.isAbove(accountsList.length, 0, "No accounts to test");
    const account = accountsList[0];

    // Unlock the account
    const privkey = await accountManager.importFromFile(PASSWORD, account.fileName);
    assert.equal(privkey.slice(0,2), '0x', 'Private key is missing the 0x prefix');
    assert.equal(privkey.length, 66, 'Private key is the wrong length');
  });

  it('should import an account from the API', async () => {
    const privkey = await accountManager.importFromAPI(TEST_EMAIL, TEST_PASSWORD);
    assert.equal(privkey.slice(0,2), '0x', 'Private key is missing the 0x prefix');
    assert.equal(privkey.length, 66, 'Private key is the wrong length');
  }).timeout(5000);
});