import { ApiConfig } from './apiConfig.js';
import { HttpClient } from './httpClient.js';
import { Transaction } from './transaction.js';

/**
 * Iris object able to do API request to Midtrans Iris API
 */
export class Iris {
  /**
   * @typedef {Object} IrisOpts
   * @property {boolean} [isProduction = false]
   * @property {string} [serverKey = '']
   * */

  /**
   * Initiate with options
   * @param  {IrisOpts} options - should have these props:
   * isProduction, apiKey
   */
  constructor(options = { isProduction: false, serverKey: '' }) {
    this.apiConfig = new ApiConfig(options);
    this.httpClient = new HttpClient(this);
    this.transaction = new Transaction(this);
  }

  /**
   * Do `/ping` API request to Iris API
   * @return {Promise<string>} - pong
   */
  ping() {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/ping';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * Do create `/beneficiaries` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise<unknown>} - Promise contains Object from JSON decoded response
   */
  createBeneficiaries(parameter = {}) {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/beneficiaries';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * Do update `/beneficiaries/<alias_name>` API request to Iris API
   * @param  {string} aliasName - name of the beneficiaries that need to be updated
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise<unknown>} - Promise contains Object from JSON decoded response
   */
  updateBeneficiaries(aliasName, parameter = {}) {
    let apiUrl =
      this.apiConfig.getIrisApiBaseUrl() + '/beneficiaries/' + aliasName;
    let responsePromise = this.httpClient.request(
      'patch',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * Do `/beneficiaries` API request to Iris API
   * @return {Promise<unknown>} - Promise contains Object from JSON decoded response
   */
  getBeneficiaries() {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/beneficiaries';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * Do create `/payouts` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise<unknown>} - Promise contains Object from JSON decoded response
   */
  createPayouts(parameter = {}) {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/payouts';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * Do approve `/payouts/approve` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  approvePayouts(parameter = {}) {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/payouts/approve';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * Do reject `/payouts/reject` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  rejectPayouts(parameter = {}) {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/payouts/reject';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * Do `/payouts/<reference_no>` API request to Iris API
   * @param  {string} referenceNo - number of the payout
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getPayoutDetails(referenceNo) {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/payouts/' + referenceNo;
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * @typedef {Object} TransactionHistory
   * @property {string=} reference_no
   * @property {string=} beneficiary_name
   * @property {string=} beneficiary_account
   * @property {string} account
   * @property {string} type
   * @property {number} amount
   * @property {string} status
   * @property {string} created_at timestamp
   *
   * */

  /**
   * Do `/statements` API request to Iris API
   *
   * @returns {Promise<TransactionHistory[]>} - transaction history
   * {@link https://iris-docs.midtrans.com/#transaction-history|Transaction History docs}
   */
  getTransactionHistory(parameter = {}) {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/statements';
    let isGetMethodWithJsonBodyParam = true;
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      null, // it doesn't use URL query param
      parameter
    ); // but it use JSON param instead, non standard
    return responsePromise;
  }

  /**
   * @typedef {Object} TopupChannel
   * @property {number} id
   * @property {string} virtual_account_type
   * @property {number} virtual_account_number
   * */

  /**
   * Do `/channels` API request to Iris API
   * @return {Promise<TopupChannel[]>} - Promise contains Object from JSON decoded response
   */
  getTopupChannels() {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/channels';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * Do `/balance` API request to Iris API
   * @return {Promise<number>} balance
   */
  getBalance() {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/balance';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * @typedef {Object} BankAccount
   * @property {string} bank_account_id
   * @property {string} bank_name
   * @property {string} account_name
   * @property {number} account_number
   * @property {"in_progress" | "live"} status
   * */

  /**
   * Do `/bank_accounts` API request to Iris API
   *
   * @return {Promise<BankAccount[]>} - Promise contains Object from JSON decoded response
   */
  getFacilitatorBankAccounts() {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/bank_accounts';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * Do `/bank_accounts/<bank_account_id>/balance` API request to Iris API
   *
   * @param {string} bankAccountId - ID of the bank account
   * @return {Promise<{balance: number}[]>} - Promise contains Object from JSON decoded response
   */
  getFacilitatorBalance(bankAccountId) {
    let apiUrl =
      this.apiConfig.getIrisApiBaseUrl() +
      '/bank_accounts/' +
      bankAccountId +
      '/balance';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * @typedef {Object} Bank
   * @property {string} code
   * @property {string} name
   * */

  /**
   * Do `/beneficiary_banks` API request to Iris API
   * @return {Promise<{beneficiary_banks: Bank[]}[]>} - Promise contains Object from JSON decoded response
   */
  getBeneficiaryBanks() {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/beneficiary_banks';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl
    );
    return responsePromise;
  }

  /**
   * @typedef {Object} ValidationOpts
   * @property {string} bank
   * @property {string} account
   * */

  /**
   * Do `/account_validation` API request to Iris API
   * @param  {ValidationOpts} [parameter = {}] - object of Iris API JSON body as parameter, will be converted to GET Query param (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise<unknown>} - Promise contains Object from JSON decoded response
   */
  validateBankAccount(parameter = {}) {
    let apiUrl = this.apiConfig.getIrisApiBaseUrl() + '/account_validation';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }
}
