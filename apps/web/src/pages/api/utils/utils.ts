/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import Web3 from 'web3';

export class Vault {
  protected _host: string = 'http://127.0.0.1';

  protected _port: string = '8545';

  protected _balance: string = '0';

  protected _account: string = '';

  protected _client: Web3;

  constructor(account: string) {
    this._client = new Web3(`${this._host}:${this._port}`);
    this._account = account;
    this.syncBalance();
  }

  async syncBalance() {
    this._balance = await this._client.eth.getBalance(this._account);
  }

  async getBalance(): Promise<string> {
    await this.syncBalance();
    return this._balance;
  }
}
