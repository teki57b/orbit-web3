/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const Web3 = require('web3');

class Vault {
  constructor() {
    this._client = new Web3(`${process.env.ORBIT_BOT_HOST}:${process.env.ORBIT_VAULT_PORT}`);
    this._account = process.env.ORBIT_WEB_ACCOUNT_KEY;
  }

  getBalance() {
    return this._client.eth.getBalance(this._account || '');
  }

  static instantiate = () => new Vault();
}

module.exports = Vault.instantiate();
