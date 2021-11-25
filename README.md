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

## Examples
Examples are available on [/examples](/examples) folder.
There are:
- [Core Api examples](/examples/coreApi)
- [Snap examples](/examples/snap)
- [Express App examples](/examples/expressApp) that implement Snap & Core Api

<!-- @TODO: document ## 5. IRIS -->

## Notes

#### Not Designed for Frontend Usage
This library/package is mainly **NOT FOR FRONTEND** (Browser's javascript) usage, but for backend (Node JS server) usage:
- This is mainly for backend usage, to do **secure server-to-server/backend-to-backend API call**.
- You may/will encounter **CORS issue if you are using** this to do API request **from frontend**.
- Your API **ServerKey may also be exposed to public** if you are using this **on frontend**.
- If what you need is to display Snap payment page on your frontend, please [follow this official documentation](https://docs.midtrans.com/en/snap/integration-guide?id=_2-displaying-snap-payment-page-on-frontend)
    - If you are using [ReactJS follow this recommendation](https://docs.midtrans.com/en/other/faq/technical?id=my-developer-uses-react-js-frontend-framework-and-is-unable-to-use-midtransminjssnapjs-what-should-i-do).

## Get help

* [Midtrans Docs](https://docs.midtrans.com)
* [Midtrans Dashboard ](https://dashboard.midtrans.com/)
* [SNAP documentation](http://snap-docs.midtrans.com)
* [Core API documentation](http://api-docs.midtrans.com)
* Can't find answer you looking for? email to [support@midtrans.com](mailto:support@midtrans.com)
