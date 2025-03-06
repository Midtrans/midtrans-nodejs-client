/**
 * These are wrapper/implementation of API methods described on:
 * https://api-docs.midtrans.com/#midtrans-api
 * @return {Promise} - Promise that contains JSON API response decoded as Object
 */
export class Transaction {
  /**
   * @param {Object} parentObj
   * @constructor
   * */
  constructor(parentObj = {}) {
    this.parent = parentObj;
  }

  /**
   * @param {string?} transactionId - transaction id
   * */
  status(transactionId = '') {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/status';
    let responsePromise = this.parent.httpClient.request(
      'get',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      null
    );
    return responsePromise;
  }

  /**
   * @param {string?} transactionId - transaction id
   * */
  statusb2b(transactionId = '') {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/status/b2b';
    let responsePromise = this.parent.httpClient.request(
      'get',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      null
    );
    return responsePromise;
  }

  /**
   * @param {string?} transactionId - transaction id
   * */
  approve(transactionId = '') {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/approve';
    let responsePromise = this.parent.httpClient.request(
      'post',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      null
    );
    return responsePromise;
  }

  /**
   * @param {string?} transactionId - transaction id
   * */
  deny(transactionId = '') {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/deny';
    let responsePromise = this.parent.httpClient.request(
      'post',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      null
    );
    return responsePromise;
  }

  /**
   * @param {string?} transactionId - transaction id
   * */
  cancel(transactionId = '') {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/cancel';
    let responsePromise = this.parent.httpClient.request(
      'post',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      null
    );
    return responsePromise;
  }

  /**
   * @param {string?} transactionId - transaction id
   * */
  expire(transactionId = '') {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/expire';
    let responsePromise = this.parent.httpClient.request(
      'post',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      null
    );
    return responsePromise;
  }

  /**
   * @param {string?} transactionId - transaction id
   * @param {Object} parameter
   * */
  refund(transactionId = '', parameter = {}) {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/refund';
    let responsePromise = this.parent.httpClient.request(
      'post',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * @param {string?} transactionId - transaction id
   * @param {Object} parameter
   * */
  refundDirect(transactionId = '', parameter = {}) {
    let apiUrl =
      this.parent.apiConfig.getCoreApiBaseUrl() +
      '/v2/' +
      transactionId +
      '/refund/online/direct';
    let responsePromise = this.parent.httpClient.request(
      'post',
      this.parent.apiConfig.get().serverKey,
      apiUrl,
      parameter
    );
    return responsePromise;
  }

  /**
   * @param {Object | string} notificationObj
   * */
  notification(notificationObj = {}) {
    let self = this;
    return new Promise(function (resolve, reject) {
      if (
        typeof notificationObj === 'string' ||
        notificationObj instanceof String
      ) {
        try {
          notificationObj = JSON.parse(notificationObj);
        } catch (err) {
          reject(
            new MidtransNotificationError(
              'fail to parse `notification` string as JSON. Use JSON string or Object as `notification`. with message:' +
                err.message
            )
          );
        }
      }
      let transactionId = notificationObj.transaction_id;
      self
        .status(transactionId)
        .then(function (res) {
          resolve(res);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
}

class MidtransNotificationError extends Error {}
