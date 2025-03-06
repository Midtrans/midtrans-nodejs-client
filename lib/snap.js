import { ApiConfig } from './apiConfig.js';
import { HttpClient } from './httpClient.js';
import { Transaction } from './transaction.js';

/**
 * @typedef {Object} ItemDetail
 * @property {string} [id]
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} [brand]
 * @property {string} [category]
 * @property {string} [merchant_name]
 * @property {string} [url]
 * */

/**
 * @typedef {Object} Address
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [postal_code]
 * @property {string} [country_code]
 * */

/**
 * @typedef {Object} CustomerDetail
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {Address} [billing_address]
 * @property {Address} [shipping_address]
 * */

/**
   * @typedef {("credit_card" | "cimb_clicks"| "bca_klikbca" | "bca_klikpay" 
    | "bri_epay" | "echannel" | "permata_va" | "bca_va"| "bni_va" | "bri_va"
    | "cimb_va" | "other_va"| "gopay" | "indomaret" | "danamon_online" 
    | "akulaku" | "shopeepay" | "kredivo" | "uob_ezpay" | "other_qris" 
    | "alfamart" | "indomaret" | "cstore"
    )} EnabledPayment
   * */

/**
 * @typedef {Object} VirtualAccount
 * @property {string} [va_number]
 * */

/**
 * @typedef {Object} BCAVirtualAccount
 * @extends VirtualAccount
 *
 * @property {string} [sub_company_code]
 * @property {FreeText} [free_text]
 * */

/**
 * @typedef {Object} FreeText
 * @property {FreeTextItem[]} inquiry
 * @property {FreeTextItem[]} payment
 * */

/**
 * @typedef {Object} FreeTextItem
 * @property {string} en
 * @property {string} id
 * */

/**
 * @typedef {Object} PermataVirtualAccount
 * @extends VirtualAccount
 *
 * @property {string} [recipient_name]
 * */

/**
 * @typedef {Object} ShopeePay
 * @property {string} [callback_url]
 * */

/**
 * @typedef {Object} GoPay
 * @property {boolean} [enable_callback = false]
 * @property {string} [callback_url]
 * @property {boolean} [tokenization = false]
 * @property {string} [phone_number=null]
 * @property {string} [country_code=null]
 * */

/**
 * @typedef {Object} Callbacks
 * @property {string} [finish]
 * @property {string} [error ]
 * */

/**
 * @typedef {"day" | "hour" | "minute" | "days" | "hours" | "minutes"} ExpiryUnit
 * */

/**
 * @typedef {Object} Expiry
 * @property {string} [start_time]
 * @property {number} duration
 * @property {ExpiryUnit} unit
 * */

/**
 * @typedef {Object} PageExpiry
 *  @property {number} duration
 *  @property {ExpiryUnit} unit
 * */

/**
 * @typedef {Object} Recurring
 * @property {boolean} required
 * @property {string} [start_time]
 * @property {string} [interval_unit]
 * */

/**
 * @typedef {Object} CreditCard
 * @property {boolean} secure
 * @property {string} bank
 * @property {string} channel
 * @property {string} type
 * @property {string[]} whitelist_bins
 * @property {Object} [installment]
 * @property {boolean} [installment.required]
 * @property {Record<string, number[]>} [installment.terms]
 * @property {Object} [dynamic_descriptor]
 * @property {string} [dynamic_descriptor.merchant_name]
 * @property {string} [dynamic_descriptor.city_name]
 * @property {string} [dynamic_descriptor.country_code]
 * */

/**
 * @typedef {Object} TransactionBody
 * @property {Object} transaction_details
 * @property {string} transaction_details.order_id
 * @property {number} transaction_details.gross_amount
 * @property {Array<ItemDetail>} [item_details]
 * @property {CustomerDetail} [costumer_details]
 * @property {Array<EnabledPayment>} [enabled_payments]
 * @property {CreditCard} [credit_card]
 * @property {BCAVirtualAccount} [bca_va]
 * @property {PermataVirtualAccount} [permata_va]
 * @property {VirtualAccount} [bni_va]
 * @property {VirtualAccount} [bri_va]
 * @property {VirtualAccount} [cimb_va]
 * @property {ShopeePay} [shopeepay]
 * @property {GoPay} [gopay]
 * @property {Callbacks} [callbacks]
 * @property {Expiry} [expiry]
 * @property {PageExpiry} [page_expiry]
 * @property {Recurring} [recurring]
 * */

/**
 * @typedef {Object} SnapResponse
 *
 * @property {string} token
 * @property {string} redirect_url
 * */

/**
 * @typedef {Object} SnapRequestError
 *
 * @property {string[]} error_messages
 * */

/**
 * Snap object used to do request to Midtrans Snap API
 */
export class Snap {
  constructor(options = { isProduction: false, serverKey: '', clientKey: '' }) {
    this.apiConfig = new ApiConfig(options);
    this.httpClient = new HttpClient(this);
    this.transaction = new Transaction(this);
  }

  /**
   * Do `/transactions` API request to Snap API
   *
   * @param {TransactionBody} [parameter = {}] - object of Core API JSON body as
   * parameter, will be converted to JSON (more params detail refer to: https://snap-docs.midtrans.com)
   *
   * @return {Promise<SnapResponse> | Promise<SnapRequestError>} - Promise contains Object from JSON decoded response
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
   * @param {TransactionBody} [parameter = {}]
   * @return {Promise} - Promise of String token
   */
  async createTransactionToken(parameter = {}) {
    const res = await this.createTransaction(parameter);
    return res.token;
  }

  /**
   * Wrapper function that call `createTransaction` then:
   *
   * @param {TransactionBody} [parameter = {}]
   * @return {Promise} - Promise of String redirect_url
   */
  async createTransactionRedirectUrl(parameter = {}) {
    const res = await this.createTransaction(parameter);
    return res.redirect_url;
  }
}
