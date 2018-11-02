'use strict'

const ApiConfig = require('./apiConfig');
const HttpClient = require('./httpClient');
const Transaction = require('./transaction');
/**
 * CoreApi object able to do API request to Midtrans Core API
 */
class CoreApi{
  /**
   * Initiate with options
   * @param  {Object} options - should have these props:
   * isProduction, serverKey, clientKey
   */
  constructor(options={isProduction:false,serverKey:'',clientKey:''}){
    this.apiConfig = new ApiConfig(options);
    this.httpClient = new HttpClient();
    this.transaction = new Transaction(this);
  }
  /**
   * Do `/charge` API request to Core API
   * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  charge(parameter={}){
    let apiUrl = this.apiConfig.getCoreApiBaseUrl()+'/charge';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/capture` API request to Core API
   * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  capture(parameter={}){
    let apiUrl = this.apiConfig.getCoreApiBaseUrl()+'/capture';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/card/register` API request to Core API
   * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  cardRegister(parameter={}){
    let apiUrl = this.apiConfig.getCoreApiBaseUrl()+'/card/register';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/token` API request to Core API
   * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  cardToken(parameter={}){
    let apiUrl = this.apiConfig.getCoreApiBaseUrl()+'/token';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/point_inquiry/<tokenId>` API request to Core API
   * @param  {String} tokenId - tokenId of credit card (more params detail refer to: https://api-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  cardPointInquiry(tokenId){
    let apiUrl = this.apiConfig.getCoreApiBaseUrl()+'/point_inquiry/'+tokenId;
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      null);
    return responsePromise;
  }
}
module.exports = CoreApi;