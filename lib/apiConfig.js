'use strict'

const _ = require('lodash');
/**
 *  Config Object that used to store isProduction, serverKey, clientKey.
 *  And also API base urls.
 */
class ApiConfig{
  /**
   * Initiate with options
   * @param  {Object} options - should have these props:
   * isProduction, serverKey, clientKey
   */
  constructor(options={isProduction:false,serverKey:'',clientKey:''}){
    this.isProduction = false;
    this.serverKey = '';
    this.clientKey = '';

    this.set(options);
  }
  /**
   * Return config stored
   * @return {Object} object contains isProduction, serverKey, clientKey
   */
  get(){
    let currentConfig = {
      isProduction : this.isProduction,
      serverKey : this.serverKey,
      clientKey : this.clientKey
    };
    return currentConfig;
  }
  /**
   * Set config stored
   * @param {Object} options - object contains isProduction, serverKey, clientKey]
   */
  set(options){
    let currentConfig = {
      isProduction : this.isProduction,
      serverKey : this.serverKey,
      clientKey : this.clientKey
    };
    const parsedOptions = _.pick(options,['isProduction','serverKey','clientKey']);
    let mergedConfig = _.merge({},currentConfig,parsedOptions);

    this.isProduction = mergedConfig.isProduction;
    this.serverKey = mergedConfig.serverKey;
    this.clientKey = mergedConfig.clientKey;
  }
  /**
   * @return {String} core api base url
   */
  getCoreApiBaseUrl(){
    return this.isProduction ?
      ApiConfig.CORE_PRODUCTION_BASE_URL : 
      ApiConfig.CORE_SANDBOX_BASE_URL;
  };

  /**
   * @return {String} snap api base url
   */
  getSnapApiBaseUrl(){
    return this.isProduction ?
      ApiConfig.SNAP_PRODUCTION_BASE_URL :
      ApiConfig.SNAP_SANDBOX_BASE_URL;
  };
}

// Static vars
ApiConfig.CORE_SANDBOX_BASE_URL = 'https://api.sandbox.midtrans.com/v2';
ApiConfig.CORE_PRODUCTION_BASE_URL = 'https://api.midtrans.com/v2';
ApiConfig.SNAP_SANDBOX_BASE_URL = 'https://app.sandbox.midtrans.com/snap/v1';
ApiConfig.SNAP_PRODUCTION_BASE_URL = 'https://app.midtrans.com/snap/v1';

module.exports = ApiConfig;