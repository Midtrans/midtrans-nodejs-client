const midtransClient = require('./../../index.js');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.
// Initialize api client object
// You can find it in Merchant Portal -> Settings -> Access keys
let apiClient = new midtransClient.Snap({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
});

// These are wrapper/implementation of API methods described on: https://api-docs.midtrans.com/#midtrans-api

// get status of transaction that already recorded on midtrans (already `charge`-ed) 
apiClient.transaction.status('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });

// get transaction status of VA b2b transaction
apiClient.transaction.statusb2b('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });

// approve a credit card transaction with `challenge` fraud status
apiClient.transaction.approve('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });

// deny a credit card transaction with `challenge` fraud status
apiClient.transaction.deny('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });

// cancel a credit card transaction or pending transaction
apiClient.transaction.cancel('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });

// expire a pending transaction
apiClient.transaction.expire('YOUR_ORDER_ID OR TRANSACTION_ID')
    .then((response)=>{
        // do something to `response` object
    });

// refund a transaction (not all payment channel allow refund via API)
let parameter = {
    "amount": 5000,
    "reason": "Item out of stock"
}
apiClient.transaction.refund('YOUR_ORDER_ID OR TRANSACTION_ID',parameter)
    .then((response)=>{
        // do something to `response` object
    });