import { pick, merge } from 'lodash-es';

/**
 *  Config Object that used to store isProduction, serverKey, clientKey.
 *  And also API base urls.
 */
export class ApiConfig {
  /**
   * @typedef {Object} APIConfigOpts
   * @property {boolean} [isProduction=false]
   * @property {string} [serverKey='']
   * @property {string} [clientKey='']
   * */

  /**
   * Initiate with options
   *
   * @param {APIConfigOpts} options
   * @constructor
   */
  constructor(options = { isProduction: false, serverKey: '', clientKey: '' }) {
    this.isProduction = false;
    this.serverKey = '';
    this.clientKey = '';

    this.set(options);
  }

  /**
   * Return config stored
   * @return {APIConfigOpts} api config props
   */
  get() {
    let currentConfig = {
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    };

    return currentConfig;
  }

  /**
   * Set config stored
   * @param {APIConfigOpts} options
   */
  set(options) {
    let currentConfig = {
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    };

    const parsedOptions = pick(options, [
      'isProduction',
      'serverKey',
      'clientKey',
    ]);

    let mergedConfig = merge({}, currentConfig, parsedOptions);

    this.isProduction = mergedConfig.isProduction;
    this.serverKey = mergedConfig.serverKey;
    this.clientKey = mergedConfig.clientKey;
  }

  /**
   * @return {String} core api base url
   */
  getCoreApiBaseUrl() {
    return this.isProduction
      ? ApiConfig.CORE_PRODUCTION_BASE_URL
      : ApiConfig.CORE_SANDBOX_BASE_URL;
  }

  /**
   * @return {String} snap api base url
   */
  getSnapApiBaseUrl() {
    return this.isProduction
      ? ApiConfig.SNAP_PRODUCTION_BASE_URL
      : ApiConfig.SNAP_SANDBOX_BASE_URL;
  }

  /**
   * @return {String} Iris api base url
   */
  getIrisApiBaseUrl() {
    return this.isProduction
      ? ApiConfig.IRIS_PRODUCTION_BASE_URL
      : ApiConfig.IRIS_SANDBOX_BASE_URL;
  }
}

// Static vars
ApiConfig.CORE_SANDBOX_BASE_URL = 'https://api.sandbox.midtrans.com';
ApiConfig.CORE_PRODUCTION_BASE_URL = 'https://api.midtrans.com';
ApiConfig.SNAP_SANDBOX_BASE_URL = 'https://app.sandbox.midtrans.com/snap/v1';
ApiConfig.SNAP_PRODUCTION_BASE_URL = 'https://app.midtrans.com/snap/v1';
// Iris API url
ApiConfig.IRIS_SANDBOX_BASE_URL =
  'https://app.sandbox.midtrans.com/iris/api/v1';
ApiConfig.IRIS_PRODUCTION_BASE_URL = 'https://app.midtrans.com/iris/api/v1';
