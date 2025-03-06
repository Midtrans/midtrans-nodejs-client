'use strict';

const ApiConfig = require('./apiConfig');
const HttpClient = require('./httpClient');
const Transaction = require('./transaction');

/**
 * Snap object used to do request to Midtrans Snap API
 */
class Snap {
  constructor(options = { isProduction: false, serverKey: '', clientKey: '' }) {
    this.apiConfig = new ApiConfig(options);
    this.httpClient = new HttpClient(this);
    this.transaction = new Transaction(this);
  }

  /**
   * @typedef {Object} TransactionBody
   * @property {Object} transaction_details
   * @property {string} transaction_details.order_id - id of order
   * @property {number} transaction_details.gross_amount
   * */

  /**
   * Do `/transactions` API request to Snap API
   *
   * @param {TransactionBody?} [parameter = {}] - object of Core API JSON body as
   * parameter, will be converted to JSON (more params detail refer to: https://snap-docs.midtrans.com)
   *
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  createTransaction(parameter = {}) {
    let apiUrl = this.apiConfig.getSnapApiBaseUrl() + '/transactions';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * Wrapper function that call `createTransaction` then:
   *
   * @param {TransactionBody?} [parameter = {}]
   * @return {Promise} - Promise of String token
   */
  async createTransactionToken(parameter = {}) {
    const res = await this.createTransaction(parameter);
    return res.token;
  }

  /**
   * Wrapper function that call `createTransaction` then:
   *
   * @param {TransactionBody?} [parameter = {}]
   * @return {Promise} - Promise of String redirect_url
   */
  async createTransactionRedirectUrl(parameter = {}) {
    const res = await this.createTransaction(parameter);
    return res.redirect_url;
  }
}

module.exports = Snap;
