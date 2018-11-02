'use strict'

const ApiConfig = require('./apiConfig');
const HttpClient = require('./httpClient');
const Transaction = require('./transaction');
/**
 * Snap object used to do request to Midtrans Snap API
 */
class Snap{
  constructor(options={isProduction:false,serverKey:'',clientKey:''}){
    this.apiConfig = new ApiConfig(options);
    this.httpClient = new HttpClient();
    this.transaction = new Transaction(this);
  }

  /**
   * Do `/transactions` API request to Snap API
   * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://snap-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  createTransaction(parameter={}){
    let apiUrl = this.apiConfig.getSnapApiBaseUrl()+'/transactions';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Wrapper function that call `createTransaction` then:
   * @return {Promise} - Promise of String token
   */
  createTransactionToken(parameter={}){
    return this.createTransaction(parameter)
      .then(function(res){
        return res.token;
      })
  }
  /**
   * Wrapper function that call `createTransaction` then:
   * @return {Promise} - Promise of String redirect_url
   */
  createTransactionRedirectUrl(parameter={}){
    return this.createTransaction(parameter)
      .then(function(res){
        return res.redirect_url;
      })
  }
}
module.exports = Snap;