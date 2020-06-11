'use strict'

const ApiConfig = require('./apiConfig');
const HttpClient = require('./httpClient');
const Transaction = require('./transaction');
/**
 * Iris object able to do API request to Midtrans Iris API
 */
class Iris{
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
   * Do `/ping` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to GET Query param (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  ping(parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/ping';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do create `/beneficiaries` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  createBeneficiaries(parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/beneficiaries';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do update `/beneficiaries/<alias_name>` API request to Iris API
   * @param  {String} parameter - alias_name of the beneficiaries that need to be updated
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  updateBeneficiaries(aliasName,parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/beneficiaries/'+aliasName;
    let responsePromise = this.httpClient.request(
      'patch',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/beneficiaries` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getBeneficiaries(){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/beneficiaries';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl);
    return responsePromise;
  }
  /**
   * Do create `/payouts` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  createPayouts(parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/payouts';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do approve `/payouts/approve` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  approvePayouts(parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/payouts/approve';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do reject `/payouts/reject` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  rejectPayouts(parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/payouts/reject';
    let responsePromise = this.httpClient.request(
      'post',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/payouts/<reference_no>` API request to Iris API
   * @param  {String} parameter - reference_no of the payout
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to GET Query param (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getPayoutDetails(referenceNo,parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/payouts/'+referenceNo;
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/statements` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
   // @TODO: fix param, allow it to accept JSON param, eventhough it's GET
   // https://iris-docs.midtrans.com/#transaction-history
  getTransactionHistory(){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/statements';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl);
    return responsePromise;
  }
  /**
   * Do `/channels` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getTopupChannels(){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/channels';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl);
    return responsePromise;
  }
  /**
   * Do `/balance` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getBalance(){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/balance';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl);
    return responsePromise;
  }
  /**
   * Do `/bank_accounts` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getBankAccounts(){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/bank_accounts';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl);
    return responsePromise;
  }
  /**
   * Do `/bank_accounts/<bank_account_id>/balance` API request to Iris API
   * @param  {String} parameter - bank_account_id of the bank account
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to GET Query param (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getFacilitatorBalance(bankAccountId,parameter={}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/bank_accounts/'+bankAccountId+'/balance';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
  /**
   * Do `/beneficiary_banks` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getBeneficiaryBanks(){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/beneficiary_banks';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl);
    return responsePromise;
  }
  /**
   * Do `/account_validation` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to GET Query param (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  validateBankAccount(parameter={'bank':'','account':''}){
    let apiUrl = this.apiConfig.getIrisApiBaseUrl()+'/account_validation';
    let responsePromise = this.httpClient.request(
      'get',
      this.apiConfig.get().serverKey,
      apiUrl,
      parameter);
    return responsePromise;
  }
}
module.exports = Iris;