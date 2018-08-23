const fs = require('fs');
const Promise = require('bluebird');
const assert = require('chai').assert;
const accountManager = require('../../build/lib/accounts');

Promise.promisifyAll(fs);

const PASSWORD = 'lunyrRocks';

describe('Account management', () => {
  it('should create a new key', async () => {
    const dk = accountManager.newKey();
    assert.isTrue(dk.privateKey instanceof Buffer);
    assert.isTrue(dk.iv instanceof Buffer);
    assert.isTrue(dk.salt instanceof Buffer);
  });

  it('should save a keypair', async () => {
    const dk = accountManager.newKey();
    const unknown = await accountManager.save(PASSWORD, dk);
    assert.isAbove(unknown.length, 0, "Filename not returned by save()");

    // Make sure it's a file that exists
    const keystoreStats = await fs.statAsync(unknown);
    assert.isTrue(keystoreStats.isFile(), "Filename is not a file");

    const keystore = await fs.openAsync(unknown, 'r');
    const keystoreString = await fs.readFileSync(keystore);
    const keystoreObj = JSON.parse(keystoreString);
    assert.equal(keystoreObj.address.length, 40, "Address does not exist")
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
    const privkey = await accountManager.unlock(account.address, PASSWORD);
    assert.equal(privkey.slice(0,2), '0x', 'Private key is missing the 0x prefix');
    assert.equal(privkey.length, 66, 'Private key is the wrong length');
  });
});