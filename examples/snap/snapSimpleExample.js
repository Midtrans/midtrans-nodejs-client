const midtransClient = require('./../../index.js');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.
// Please refer to this docs for snap popup:
// https://docs.midtrans.com/en/snap/integration-guide?id=integration-steps-overview

// Please refer to this docs for snap-redirect:
// https://docs.midtrans.com/en/snap/integration-guide?id=alternative-way-to-display-snap-payment-page-via-redirect

// Initialize api client object
// You can find it in Merchant Portal -> Settings -> Access keys
let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
});

// prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
let parameter = {
    "transaction_details": {
        "order_id": "test-transaction-123",
        "gross_amount": 200000
    }, "credit_card":{
        "secure" : true
    }
};

// create transaction
snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction token
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);

        // transaction redirect url
        let transactionRedirectUrl = transaction.redirect_url;
        console.log('transactionRedirectUrl:',transactionRedirectUrl);
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    });

// transaction is object representation of API JSON response
// sample:
// {
// 'redirect_url': 'https://app.sandbox.midtrans.com/snap/v2/vtweb/f0a2cbe7-dfb7-4114-88b9-1ecd89e90121', 
// 'token': 'f0a2cbe7-dfb7-4114-88b9-1ecd89e90121'
// }