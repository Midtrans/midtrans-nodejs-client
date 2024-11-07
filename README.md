Midtrans Client - Node JS
===============
[![NPM](https://nodei.co/npm/midtrans-client.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/midtrans-client/)

[![npm version](https://img.shields.io/npm/v/midtrans-client.svg?style=flat-square)](https://www.npmjs.org/package/midtrans-client)
[![Build Status](https://travis-ci.org/rizdaprasetya/midtrans-nodejs-client.svg?branch=master)](https://travis-ci.org/rizdaprasetya/midtrans-nodejs-client)
![NPM download/month](https://img.shields.io/npm/dm/midtrans-client.svg)
![NPM download total](https://img.shields.io/npm/dt/midtrans-client.svg)

Midtrans ❤️ Node JS! 

This is the Official Node JS API client/library for Midtrans Payment API. Visit [https://midtrans.com](https://midtrans.com). More information about the product and see documentation at [http://docs.midtrans.com](https://docs.midtrans.com) for more technical details.

## 1. Installation

### 1.a Using NPM

```
npm install --save midtrans-client
```

### 1.b Manual Installation

If you are not using NPM, you can clone or [download](https://github.com/midtrans/midtrans-nodejs-client/archive/master.zip) this repository.
Then require from `index.js` file.

```javascript
let midtransClient = require('./midtrans-client-nodejs/index.js');
```

## 2. Usage

### 2.1 Choose Product/Method

We have [2 different products](https://docs.midtrans.com/en/welcome/index.html) of payment that you can use:
- [Snap](#22A-snap) - Customizable payment popup will appear on **your web/app** (no redirection). [doc ref](https://snap-docs.midtrans.com/)
- [Snap Redirect](#22B-snap-redirect) - Customer need to be redirected to payment url **hosted by midtrans**. [doc ref](https://snap-docs.midtrans.com/)
- [Core API (VT-Direct)](#22C-core-api-vt-direct) - Basic backend implementation, you can customize the frontend embedded on **your web/app** as you like (no redirection). [doc ref](https://api-docs.midtrans.com/)

Choose one that you think best for your unique needs.

### 2.2 Client Initialization and Configuration

Get your client key and server key from [Midtrans Dashboard](https://dashboard.midtrans.com)

Create API client object

```javascript
const midtransClient = require('midtrans-client');
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });
```


```javascript
const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });
```

You can also re-set config using `Snap.apiConfig.set( ... )`
example:

```javascript
const midtransClient = require('midtrans-client');

// Create Snap API instance, empty config
let snap = new midtransClient.Snap();
snap.apiConfig.set({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

// You don't have to re-set using all the options, 
// i.e. set serverKey only
snap.apiConfig.set({serverKey : 'YOUR_SERVER_KEY'});
```

You can also set config directly from attribute
```javascript
const midtransClient = require('midtrans-client');

// Create Snap API instance, empty config
let snap = new midtransClient.Snap();

snap.apiConfig.isProduction = false;
snap.apiConfig.serverKey = 'YOUR_SERVER_KEY';
snap.apiConfig.clientKey = 'YOUR_CLIENT_KEY';
```


### 2.2.A Snap
You can see Snap example [here](examples/snap).

Available methods for `Snap` class
```javascript
// return Snap API /transaction response as Promise of Object
createTransaction(parameter)

// return Snap API /transaction token as Promise of String
createTransactionToken(parameter)

// return Snap API /transaction redirect_url as Promise of String
createTransactionRedirectUrl(parameter)
```
`parameter` is Object or String of JSON of [SNAP Parameter](https://snap-docs.midtrans.com/#json-objects)


#### Get Snap Token

```javascript
const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

let parameter = {
    "transaction_details": {
        "order_id": "test-transaction-123",
        "gross_amount": 200000
    }, "credit_card":{
        "secure" : true
    }
};


snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction token
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
    })

// alternative way to create transactionToken
// snap.createTransactionToken(parameter)
//     .then((transactionToken)=>{
//         console.log('transactionToken:',transactionToken);
//     })
```


#### Initialize Snap JS when customer click pay button

On frontend / html:
Replace `PUT_TRANSACTION_TOKEN_HERE` with `transactionToken` acquired above
```html
<html>
  <body>
    <button id="pay-button">Pay!</button>
    <pre><div id="result-json">JSON result will appear here after payment:<br></div></pre> 

<!-- TODO: Remove ".sandbox" from script src URL for production environment. Also input your client key in "data-client-key" -->
    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="<Set your ClientKey here>"></script>
    <script type="text/javascript">
      document.getElementById('pay-button').onclick = function(){
        // SnapToken acquired from previous step
        snap.pay('PUT_TRANSACTION_TOKEN_HERE', {
          // Optional
          onSuccess: function(result){
            /* You may add your own js here, this is just example */ document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
          },
          // Optional
          onPending: function(result){
            /* You may add your own js here, this is just example */ document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
          },
          // Optional
          onError: function(result){
            /* You may add your own js here, this is just example */ document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
          }
        });
      };
    </script>
  </body>
</html>
```

#### Implement Notification Handler
[Refer to this section](#23-handle-http-notification)

### 2.2.B Snap Redirect

Also available as examples [here](examples/snap).

#### Get Redirection URL of a Payment Page

```javascript
const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

let parameter = {
    "transaction_details": {
        "order_id": "test-transaction-123",
        "gross_amount": 200000
    }, "credit_card":{
        "secure" : true
    }
};

snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction redirect_url
        let redirectUrl = transaction.redirect_url;
        console.log('redirectUrl:',redirectUrl);
    })

// alternative way to create redirectUrl
// snap.createTransactionRedirectUrl(parameter)
//     .then((redirectUrl)=>{
//         console.log('redirectUrl:',redirectUrl);
//     })
```
#### Implement Notification Handler
[Refer to this section](#23-handle-http-notification)

### 2.2.C Core API (VT-Direct)

You can see some Core API examples [here](examples/coreApi).

Available methods for `CoreApi` class
```javascript
/**
 * Do `/charge` API request to Core API
 * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
 * @return {Promise} - Promise contains Object from JSON decoded response
 */
charge(parameter={})

/**
 * Do `/capture` API request to Core API
 * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
 * @return {Promise} - Promise contains Object from JSON decoded response
 */
capture(parameter={})

/**
 * Do `/card/register` API request to Core API
 * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
 * @return {Promise} - Promise contains Object from JSON decoded response
 */
cardRegister(parameter={})

/**
 * Do `/token` API request to Core API
 * @param  {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
 * @return {Promise} - Promise contains Object from JSON decoded response
 */
cardToken(parameter={})

/**
 * Do `/point_inquiry/<tokenId>` API request to Core API
 * @param  {String} tokenId - tokenId of credit card (more params detail refer to: https://api-docs.midtrans.com)
 * @return {Promise} - Promise contains Object from JSON decoded response
 */
cardPointInquiry(tokenId)
```
`parameter` is Object or String of JSON of [Core API Parameter](https://api-docs.midtrans.com/#json-objects)

#### Credit Card Get Token

Get token should be handled on  Frontend please refer to [API docs](https://api-docs.midtrans.com)

#### Credit Card Charge

```javascript
const midtransClient = require('midtrans-client');
// Create Core API instance
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

let parameter = {
    "payment_type": "credit_card",
    "transaction_details": {
        "gross_amount": 12145,
        "order_id": "test-transaction-54321",
    },
    "credit_card":{
        "token_id": 'CREDIT_CARD_TOKEN', // change with your card token
        "authentication": true
    }
};

// charge transaction
core.charge(parameter)
    .then((chargeResponse)=>{
        console.log('chargeResponse:');
        console.log(chargeResponse);
    });
```

#### Credit Card 3DS Authentication

The credit card charge result may contains `redirect_url` for 3DS authentication. 3DS Authentication should be handled on Frontend please refer to [API docs](https://api-docs.midtrans.com/#card-features-3d-secure)

For full example on Credit Card 3DS transaction refer to:
- [Express App examples](/examples/expressApp) that implement Snap & Core Api

### 2.2.D Subscription API

You can see some Subscription API examples [here](examples/subscription), [Subscription API Docs](https://api-docs.midtrans.com/#subscription-api)

#### Subscription API for Credit Card

To use subscription API for credit card, you should first obtain the 1-click saved token, [refer to this docs.](https://docs.midtrans.com/en/core-api/advanced-features?id=recurring-transaction-with-subscriptions-api)

You will receive `saved_token_id` as part of the response when the initial card payment is accepted (will also available in the HTTP notification's JSON), [refer to this docs.](https://docs.midtrans.com/en/core-api/advanced-features?id=sample-3ds-authenticate-json-response-for-the-first-transaction)

```javascript
const midtransClient = require('midtrans-client');
// Create Core API / Snap instance (both have shared `transactions` methods)
let core = new midtransClient.CoreAPi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });
// prepare parameter 
let parameter = {
  "name": "MONTHLY_2021",
  "amount": "14000",
  "currency": "IDR",
  "payment_type": "credit_card",
  "token": "521111gmWqMegyejqCQmmopnCFRs1117",
  "schedule": {
    "interval": 1,
    "interval_unit": "month",
    "max_interval": 12,
    "start_time": "2021-11-25 07:25:01 +0700"
  },
  "metadata": {
    "description": "Recurring payment for A"
  },
  "customer_details": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@email.com",
    "phone": "+62812345678"
  }
};

core.createSubscription(parameter)
        .then((response)=>{
          // do something to `response` object
        });

// get subscription by subscriptionId
core.getSubscription(subscriptionId)
        .then((response)=>{
          // do something to `response` object
        });

// enable subscription by subscriptionId
core.enableSubscription(subscriptionId)
        .then((response)=>{
          // do something to `response` object
        });

// update subscription by subscriptionId and updateSubscriptionParam
let updateSubscriptionParam = {
  "name": "MONTHLY_2021",
  "amount": "300000",
  "currency": "IDR",
  "token": savedTokenId,
  "schedule": {
    "interval": 1
  }
}
core.updateSubscription(subscriptionId, updateSubscriptionParam)
        .then((response)=>{
          // do something to `response` object
        });
```
#### Subscription API for Gopay

To use subscription API for gopay, you should first link your customer gopay account with gopay tokenization API, [refer to this section](#22e-tokenization-api)

You will receive gopay payment token using `getPaymentAccount` API call

You can see some Subscription API examples [here](examples/subscription)

### 2.2.E Tokenization API
You can see some Tokenization API examples [here](examples/tokenization), [Tokenization API Docs](https://api-docs.midtrans.com/#gopay-tokenization)

```javascript
const midtransClient = require('midtrans-client');
// Create Core API / Snap instance (both have shared `transactions` methods)
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

// prepare parameter 
let parameter = {
  "payment_type": "gopay",
  "gopay_partner": {
    "phone_number": "81212345678",
    "country_code": "62",
    "redirect_url": "https://www.gojek.com"
  }
};

// link Payment Account
core.linkPaymentAccount(parameter)
        .then((response)=>{
          // do something to `response` object
        });

// Get payment account by account id
core.getPaymentAccount(activeAccountId)
        .then((response)=>{
          // do something to `response` object
        });

// unlink payment account by accountId
core.unlinkPaymentAccount(activeAccountId)
        .then((response)=>{
          // do something to `response` object
        });

```

### 2.3 Handle HTTP Notification

> **IMPORTANT NOTE**: To update transaction status on your backend/database, **DO NOT** solely rely on frontend callbacks! For security reason to make sure the status is authentically coming from Midtrans, only update transaction status based on HTTP Notification or API Get Status.

Create separated web endpoint (notification url) to receive HTTP POST notification callback/webhook. 
HTTP notification will be sent whenever transaction status is changed.
Example also available [here](examples/transactionActions/notificationExample.js)

```javascript
const midtransClient = require('midtrans-client');
// Create Core API / Snap instance (both have shared `transactions` methods)
let apiClient = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

apiClient.transaction.notification(notificationJson)
    .then((statusResponse)=>{
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // Sample transactionStatus handling logic

        if (transactionStatus == 'capture'){
            // capture only applies to card transaction, which you need to check for the fraudStatus
            if (fraudStatus == 'challenge'){
                // TODO set transaction status on your databaase to 'challenge'
            } else if (fraudStatus == 'accept'){
                // TODO set transaction status on your databaase to 'success'
            }
        } else if (transactionStatus == 'settlement'){
            // TODO set transaction status on your databaase to 'success'
        } else if (transactionStatus == 'deny'){
            // TODO you can ignore 'deny', because most of the time it allows payment retries
            // and later can become success
        } else if (transactionStatus == 'cancel' ||
          transactionStatus == 'expire'){
            // TODO set transaction status on your databaase to 'failure'
        } else if (transactionStatus == 'pending'){
            // TODO set transaction status on your databaase to 'pending' / waiting payment
        }
    });
```

### 2.4 Transaction Action
Also available as examples [here](examples/transactionActions)
#### Get Status
```javascript
// get status of transaction that already recorded on midtrans (already `charge`-ed) 
apiClient.transaction.status('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });
```
#### Get Status B2B
```javascript
// get transaction status of VA b2b transaction
apiClient.transaction.statusb2b('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });
```
#### Approve Transaction
```javascript
// approve a credit card transaction with `challenge` fraud status
apiClient.transaction.approve('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });
```
#### Deny Transaction
```javascript
// deny a credit card transaction with `challenge` fraud status
apiClient.transaction.deny('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });
```
#### Cancel Transaction
```javascript
apiClient.transaction.cancel('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });
```
#### Expire Transaction
```javascript
apiClient.transaction.expire('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });
```
#### Refund Transaction
```javascript
let parameter = {
    "refund_key": "order1-ref1",
    "amount": 5000,
    "reason": "Item out of stock"
}
apiClient.transaction.refund('YOUR_ORDER_ID OR TRANSACTION_ID',parameter)
    .then((response)=>{
        // do something to `response` object
    });
```
#### Refund Transaction with Direct Refund
```javascript
let parameter = {
    "refund_key": "order1-ref1",
    "amount": 5000,
    "reason": "Item out of stock"
}
apiClient.transaction.refundDirect('YOUR_ORDER_ID OR TRANSACTION_ID',parameter)
    .then((response)=>{
        // do something to `response` object
    });
```

## 3. Handling Error / Exception
When using function that result in Midtrans API call e.g: `core.charge(...)` or `snap.createTransaction(...)` 
there's a chance it may throw error (`MidtransError` object), the error object will contains below properties that can be used as information to your error handling logic:
```javascript
snap.createTransaction(parameter)
      .then((res)=>{
      })
      .catch((e)=>{
        e.message // basic error message string
        e.httpStatusCode // HTTP status code e.g: 400, 401, etc.
        e.ApiResponse // JSON of the API response 
        e.rawHttpClientData // raw Axios response object
      })
```

## 4. Advanced Usage
### Custom Http Client Config
Under the hood this API wrapper is using [Axios](https://github.com/axios/axios) as http client. You can override the default config. 

You can set via the value of this `<api-client-instance>.httpClient.http_client.defaults` object, like [described in Axios guide](https://github.com/axios/axios#global-axios-defaults). e.g:
```javascript
// create instance of api client
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

// set Axios timeout config to 2500
snap.httpClient.http_client.defaults.timeout = 2500; 

// set custom HTTP header for every request from this instance
snap.httpClient.http_client.defaults.headers.common['My-Header'] = 'my-custom-value';
```
### Custom Http Client Interceptor
As Axios [also support interceptor](https://github.com/axios/axios#interceptors), you can also apply it here. e.g:
```javascript
// Add a request interceptor
snap.httpClient.http_client.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
```

It can be used for example to customize/manipulate http request's body, header, etc. before it got sent to the destination API url.

### Override Http Notification Url
As [described in API docs](https://snap-docs.midtrans.com/#override-notification-url), merchant can opt to change or add custom notification urls on every transaction. It can be achieved by adding additional HTTP headers into charge request.

This can be achived by:
```javascript
// create instance of api client
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
});

// set custom HTTP header that will be used by Midtrans API to override notification url:
snap.httpClient.http_client.defaults.headers.common['X-Override-Notification'] = 'https://mysite.com/midtrans-notification-handler';
```

or append notification:
```javascript
snap.httpClient.http_client.defaults.headers.common['X-Append-Notification'] = 'https://mysite.com/midtrans-notification-handler';
```

## 5. Iris Disbursement API

[Iris](https://iris-docs.midtrans.com) is Midtrans’ cash management solution that allows you to disburse payments to any bank accounts in Indonesia securely and easily. Iris connects to the banks’ hosts to enable seamless transfer using integrated APIs.

For more details please visit: https://iris-docs.midtrans.com

### 5.1 Client Initialization

Get your API key from [Midtrans Iris Dashboard](https://app.midtrans.com/iris)

Create API client object. Note: the serverKey means your API key.

```javascript
const midtransClient = require('midtrans-client');
// Create Core API instance
let iris = new midtransClient.Iris({
        isProduction : false,
        serverKey : 'YOUR_API_KEY'
    });
```

Then perform one of the available functions, using the payload described on [Iris docs](https://iris-docs.midtrans.com), e.g:
```javascript
let iris = new midtransClient.Iris({
        isProduction : false,
        serverKey : 'YOUR_API_KEY'
    });

iris.createBeneficiaries({
  "name": "Budi Susantoo",
  "account": "0611101146",
  "bank": "bca",
  "alias_name": "budisusantoo",
  "email": "budi.susantoo@example.com"
})
  .then((res)=>{
    // do something based on the API response
  })
  .catch((err)=>{
    // do something based on the Error object & message
  })
```

### 5.2 Available methods of Iris API

```javascript

  /**
   * Do `/ping` API request to Iris API
   * @return {Promise} - Promise contains String response
   */
  ping()
  /**
   * Do create `/beneficiaries` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  createBeneficiaries(parameter={})
  /**
   * Do update `/beneficiaries/<alias_name>` API request to Iris API
   * @param  {String} parameter - alias_name of the beneficiaries that need to be updated
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  updateBeneficiaries(aliasName,parameter={})
  /**
   * Do `/beneficiaries` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getBeneficiaries()
  /**
   * Do create `/payouts` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  createPayouts(parameter={})
  /**
   * Do approve `/payouts/approve` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  approvePayouts(parameter={})
  /**
   * Do reject `/payouts/reject` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to JSON (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  rejectPayouts(parameter={})
  /**
   * Do `/payouts/<reference_no>` API request to Iris API
   * @param  {String} parameter - reference_no of the payout
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getPayoutDetails(referenceNo)
  /**
   * Do `/statements` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getTransactionHistory(parameter={})
  /**
   * Do `/channels` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getTopupChannels()
  /**
   * Do `/balance` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getBalance()
  /**
   * Do `/bank_accounts` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getFacilitatorBankAccounts()
  /**
   * Do `/bank_accounts/<bank_account_id>/balance` API request to Iris API
   * @param  {String} parameter - bank_account_id of the bank account
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getFacilitatorBalance(bankAccountId)
  /**
   * Do `/beneficiary_banks` API request to Iris API
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  getBeneficiaryBanks()
  /**
   * Do `/account_validation` API request to Iris API
   * @param  {Object} parameter - object of Iris API JSON body as parameter, will be converted to GET Query param (more params detail refer to: https://iris-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  validateBankAccount(parameter={})
```
You can also refer to [Iris test cases](/test/iris.test.js) for sample usage for now. Dedicated sample usage might be written later in the future.

## 6. Snap-BI (*NEW FEATURE starting v1.4.2)
Standar Nasional Open API Pembayaran, or in short SNAP, is a national payment open API standard published by Bank Indonesia. To learn more you can read this [docs](https://docs.midtrans.com/reference/core-api-snap-open-api-overview)

### 6.1 General Settings

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

//These config value are based on the header stated here https://docs.midtrans.com/reference/getting-started-1
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
midtransClient.SnapBiConfig.isProduction = true
// Set your client id. Merchant’s client ID that will be given by Midtrans, will be used as X-CLIENT-KEY on request’s header in B2B Access Token API.
midtransClient.SnapBiConfig.snapBiClientId = "your client id"
// Set your private key here, make sure to add \n on the private key, you can refer to the examples
midtransClient.SnapBiConfig.snapBiPrivateKey = "your private key";
// Set your client secret. Merchant’s secret key that will be given by Midtrans, will be used for symmetric signature generation for Transactional API’s header.
midtransClient.SnapBiConfig.snapBiClientSecret = "your client secret";
// Set your partner id. Merchant’s partner ID that will be given by Midtrans, will be used as X-PARTNER-ID on Transactional API’s header.
midtransClient.SnapBiConfig.snapBiPartnerId = "your partner id";
// Set the channel id here.
midtransClient.SnapBiConfig.snapBiChannelId = "your channel id";
// Enable logging to see details of the request/response make sure to disable this on production, the default is disabled.
midtransClient.SnapBiConfig.enableLogging = true;
```

### 6.2 Create Payment

#### 6.2.1 Direct Debit (Gopay, Dana, Shopeepay)
Refer to this [docs](https://docs.midtrans.com/reference/direct-debit-api-gopay) for more detailed information about creating payment using direct debit.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

const externalId = randomUUID();
let directDebiRequestBody = {
  "partnerReferenceNo": externalId,
  "chargeToken": "",
  "merchantId": merchantId,
  "urlParam": {
    "url": "https://midtrans-test.com/api/notification",
    "type": "PAY_RETURN",
    "isDeeplink": "N"
  },
  "validUpTo": "2030-07-20T20:34:15.452305Z",
  "payOptionDetails": [
    {
      "payMethod": "GOPAY",
      "payOption": "GOPAY_WALLET",
      "transAmount": {
        "value": "1500",
        "currency": "IDR"
      }
    }
  ],
  "additionalInfo": {
    "customerDetails": {
      "firstName": "Merchant",
      "lastName": "Operation",
      "email": "merchant-ops@midtrans.com",
      "phone": "+6281932358123",
      "billingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      },
      "shippingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      }
    },
    "items": [
      {
        "id": "8143fc4f-ec05-4c55-92fb-620c212f401e",
        "price": {
          "value": "1500.00",
          "currency": "IDR"
        },
        "quantity": 1,
        "name": "test item name",
        "brand": "test item brand",
        "category": "test item category",
        "merchantName": "Merchant Operation"
      }
    ]
  }
}
/**
 *  Basic example
 * to change the payment method, you can change the value of the request body on the `payOptionDetails`
 * the `currency` value that we support for now is only `IDR`
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebiRequestBody)
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

```
#### 6.2.2 VA (Bank Transfer)
Refer to this [docs](https://docs.midtrans.com/reference/virtual-account-api-bank-transfer) for more detailed information about VA/Bank Transfer.
```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

const externalId = randomUUID();
let vaRequestBody = {
  "partnerServiceId": "    1234",
  "customerNo": "0000000000",
  "virtualAccountNo": "    12340000000000",
  "virtualAccountName": "Merchant Operation",
  "virtualAccountEmail": "merchant-ops@midtrans.com",
  "virtualAccountPhone": "6281932358123",
  "trxId": externalId,
  "totalAmount": {
    "value": "1500.00",
    "currency": "IDR"
  },
  "expiredDate": "2030-07-20T20:50:04Z",
  "additionalInfo": {
    "merchantId": merchantId,
    "bank": "bca",
    "flags": {
      "shouldRandomizeVaNumber": true
    },
    "customerDetails": {
      "firstName": "Merchant",
      "lastName": "Operation",
      "email": "merchant-ops@midtrans.com",
      "phone": "+6281932358123",
      "billingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      },
      "shippingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      }
    },
    "items": [
      {
        "id": "8143fc4f-ec05-4c55-92fb-620c212f401e",
        "price": {
          "value": "1500.00",
          "currency": "IDR"
        },
        "quantity": 1,
        "name": "test item name",
        "brand": "test item brand",
        "category": "test item category",
        "merchantName": "Merchant Operation"
      }
    ]
  }
}


/**
 * basic implementation to create payment using va
 */
midtransClient.SnapBi.va()
        .withBody(vaRequestBody)
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```
#### 6.2.3 Qris
Refer to this [docs](https://docs.midtrans.com/reference/mpm-api-qris) for more detailed information about Qris.
```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

const externalId = randomUUID();

let additionalHeader = {
  "X-device-id": "your device id",
  "debug-id": "your debug id"
}

let qrisRequestBody = {
  "partnerReferenceNo": externalId,
  "merchantId": merchantId,
  "amount": {
    "value": "1500.00",
    "currency": "IDR"
  },
  "validityPeriod": "2030-07-03T12:08:56-07:00",
  "additionalInfo": {
    "acquirer": "gopay",
    "customerDetails": {
      "firstName": "Merchant",
      "lastName": "Operation",
      "email": "merchant-ops@midtrans.com",
      "phone": "+6281932358123"
    },
    "items": [
      {
        "id": "8143fc4f-ec05-4c55-92fb-620c212f401e",
        "price": {
          "value": "1500.00",
          "currency": "IDR"
        },
        "quantity": 1,
        "name": "test item name",
        "brand": "test item brand",
        "category": "test item category",
        "merchantName": "Merchant Operation"
      }
    ],
    "countryCode": "ID",
    "locale": "id_ID"
  }
}

/**
 * basic implementation to create payment using Qris
 */
midtransClient.SnapBi.qris()
        .withBody(qrisRequestBody)
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

### 6.4 Get Transaction Status
Refer to this [docs](https://docs.midtrans.com/reference/get-transaction-status-api) for more detailed information about getting the transaction status.
```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

let directDebitStatusBodyByExternalId = {
  "originalExternalId": "67fd4d9e-5fe6-477c-ab99-026a9ab88c34",
  "serviceCode": "54"
}
let directDebitStatusBodyByReferenceNo = {
  "originalReferenceNo": "A120240930071006pW0gbFMTguID",
  "serviceCode": "54"
}

let vaStatusBody = {
  "partnerServiceId": "    1234",
  "customerNo": "356899",
  "virtualAccountNo": "    1234356899",
  "inquiryRequestId": "5a5597d1-615d-4df0-875d-aa429b2b1b68",
  "additionalInfo": {
    "merchantId": merchantId
  }
}

let qrisStatusBody = {
  "originalReferenceNo": "A120240930074508BIDP4QaNnJID",
  "originalPartnerReferenceNo": "b7d2bc2e-9d5b-4cec-a39f-4244c11e1b98",
  "merchantId": merchantId,
  "serviceCode": "47"
}

/**
 * Example code for Direct Debit getStatus using externalId
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitStatusBodyByExternalId)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

/**
 * Example code for Direct Debit getStatus using referenceNo
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitStatusBodyByReferenceNo)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
    
/**
 * Example code for VA (Bank Transfer) getStatus
 */
midtransClient.SnapBi.va()
        .withBody(vaStatusBody)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
/**
 * 
 * Example code for Qris getStatus
 */
midtransClient.SnapBi.qris()
        .withBody(qrisStatusBody)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

```

### 6.5 Cancel Transaction
Refer to this [docs](https://docs.midtrans.com/reference/cancel-api) for more detailed information about cancelling the payment.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

const externalId = randomUUID();

let directDebitCancelByReferenceNoBody = {
  "originalReferenceNo" : "A120240930075800vyWwxohb5WID"
}

let directDebitCancelByExternalIdBody = {
  "originalExternalId" : "8a074fc8-4eac-4b06-959a-95aeb91c7920"
}

let vaCancelBody = {
  "partnerServiceId": "    1234",
  "customerNo": "564902",
  "virtualAccountNo": "    1234564902",
  "trxId": "18f2bd6d-e1be-43e2-89e4-8f9088251f60",
  "additionalInfo": {
    "merchantId": merchantId
  }
}

let qrisCancelBody = {
  "originalReferenceNo": "A120240930075936LUOBMHxvPOID",
  "merchantId": merchantId,
  "reason": "cancel reason"
}
/**
 * Basic implementation to cancel transaction using referenceNo
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitCancelByReferenceNoBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

/**
 * Basic implementation to cancel transaction using externalId
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitCancelByExternalIdBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

/**
 * Basic implementation of VA (Bank Transfer) to cancel transaction
 */
midtransClient.SnapBi.va()
        .withBody(vaCancelBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

/**
 * Basic implementation of Qris to cancel transaction
 */
midtransClient.SnapBi.qris()
        .withBody(qrisCancelBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

```

### 6.6 Refund Transaction
Refer to this [docs](https://docs.midtrans.com/reference/refund-api) for more detailed information about refunding the payment.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

 let directDebitRefundBody = {
  "originalReferenceNo": "A1202409300808041pswnOt7wMID",
  "reason" : "refund reason"
}

let qrisRefundBody = {
  "merchantId": merchantId,
  "originalPartnerReferenceNo": "488fd30e-64d7-4236-9e7a-82d55d9efad3",
  "originalReferenceNo": "A1202409300907114b5RZRNSRuID",
  "partnerRefundNo": "is-refund-12345",
  "reason": "refund reason",
  "refundAmount": {
    "value": "100.00",
    "currency": "IDR"
  },
  "additionalInfo": {
    "foo": "bar"
  }
}
/**
 * Example code for refund using Direct Debit
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitRefundBody)
        .refund(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

/**
 * Example code for refund using Qris
 */
midtransClient.SnapBi.qris()
        .withBody(qrisRefundBody)
        .refund(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

### 6.7 Adding additional header / override the header

You can add or override the header value, by utilizing the `withAccessTokenHeader` or `withTransactionHeader` method chain.
Refer to this [docs](https://docs.midtrans.com/reference/core-api-snap-open-api-overview) to see the header value required by Snap-Bi , and see the default header on each payment method

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

let additionalHeader = {
  "X-device-id": "your device id",
  "debug-id": "your debug id"
}
 /**
 * Example code for Direct Debit payment using additional header
 */
 midtransClient.SnapBi.directDebit()
         .withBody(directDebiRequestBody)
         .withAccessTokenHeader(additionalHeader)
         .withTransactionHeader(additionalHeader)
         .createPayment(externalId)
         .then(r =>
                 console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
         )
/**
 * Example code for using additional header on creating payment using VA
 */
midtransClient.SnapBi.va()
        .withBody(vaRequestBody)
        .withAccessTokenHeader(additionalHeader)
        .withTransactionHeader(additionalHeader)
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

### 6.8 Reusing Access Token

If you've saved your previous access token and wanted to re-use it, you can do it by utilizing the `.withAccessToken()`.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM
/**
 * Example reusing your existing accessToken by using .withAccessToken()
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebiRequestBody)
        .withAccessToken("your access token")
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

```

### 6.9 Payment Notification
To implement Snap-Bi Payment Notification you can refer to this [docs](https://docs.midtrans.com/reference/payment-notification-api)
To verify the webhook notification that you receive you can use this method below
```javascript
 const midtransClient = require('midtrans-client'); // use this if installed via NPM

// The request body/ payload sent by the webhook
// Sample notification body, replace with actual data you receive from Midtrans
let notificationPayload = "{\"originalPartnerReferenceNo\":\"GP24043015193402809\",\"originalReferenceNo\":\"A120240430081940S9vu8gSjaRID\",\"merchantId\":\"G099333790\",\"amount\":{\"value\":\"102800.00\",\"currency\":\"IDR\"},\"latestTransactionStatus\":\"00\",\"transactionStatusDesc\":\"SUCCESS\",\"additionalInfo\":{\"refundHistory\":[]}}";

// To get the signature value, you need to retrieve it from the webhook header called X-Signature
let signature = "CgjmAyC9OZ3pB2JhBRDihL939kS86LjP1VLD1R7LgI4JkvYvskUQrPXgjhrZqU2SFkfPmLtSbcEUw21pg2nItQ0KoX582Y6Tqg4Mn45BQbxo4LTPzkZwclD4WI+aCYePQtUrXpJSTM8D32lSJQQndlloJfzoD6Rh24lNb+zjUpc+YEi4vMM6MBmS26PpCm/7FZ7/OgsVh9rlSNUsuQ/1QFpldA0F8bBNWSW4trwv9bE1NFDzliHrRAnQXrT/J3chOg5qqH0+s3E6v/W21hIrBYZVDTppyJPtTOoCWeuT1Tk9XI2HhSDiSuI3pevzLL8FLEWY/G4M5zkjm/9056LTDw==";

// To get the timeStamp value, you need to retrieve it from the webhook header called X-Timestamp
let timeStamp = "2024-10-07T15:45:22+07:00";

// The url path is based on the webhook url of the payment method for example for direct debit is `/v1.0/debit/notify`
let notificationUrlPath = "/v1.0/debit/notify";
/**
 * Example verifying the webhook notification
 */
let isVerified = midtransClient.SnapBi.notification()
        .withNotificationPayload(notificationPayload)
        .withSignature(signature)
        .withTimeStamp(timeStamp)
        .withNotificationUrlPath(notificationUrlPath)
        .isWebhookNotificationVerified()
```
## Examples
Examples are available on [/examples](/examples) folder.
There are:
- [Core Api examples](/examples/coreApi)
- [Snap examples](/examples/snap)
- [Express App examples](/examples/expressApp) that implement Snap, Core Api & SnapBi
- [Snap Bi examples](/examples/expressApp/SnapBi)

<!-- @TODO: document ## 5. IRIS -->

## Notes

#### Not Designed for Frontend Usage
This library/package is mainly **NOT FOR FRONTEND** (Browser's javascript) usage, but for backend (Node JS server) usage:
- This is mainly for backend usage, to do **secure server-to-server/backend-to-backend API call**.
- You may/will encounter **CORS issue if you are using** this to do API request **from frontend**.
- Your API **ServerKey may also be exposed to public** if you are using this **on frontend**.
- If what you need is to display Snap payment page on your frontend, please [follow this official documentation](https://docs.midtrans.com/en/snap/integration-guide?id=_2-displaying-snap-payment-page-on-frontend)
    - If you are using [ReactJS follow this recommendation](https://docs.midtrans.com/docs/technical-faq#my-developer-uses-react-js-frontend-framework-and-is-unable-to-use-midtransminjssnapjs-what-should-i-do).

## Get help

* [Midtrans Docs](https://docs.midtrans.com)
* [Midtrans Dashboard ](https://dashboard.midtrans.com/)
* [SNAP documentation](http://snap-docs.midtrans.com)
* [Core API documentation](http://api-docs.midtrans.com)
* Can't find answer you looking for? email to [support@midtrans.com](mailto:support@midtrans.com)
