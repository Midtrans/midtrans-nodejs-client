import midtransClient, { SnapInterface, snapOptions, transactionError } from './../../index.js';
/**
 * If the package is installed via NPM / Yarn, use this instead:
 * 
 *  import midtransClient from 'midtrans-client';
 * 
 * If you want to import interface from typings, use:
 * 
 *  import midtransClient, { SnapInterface, snapOptions, transactionError } from "midtrans-client";
 * */ 

// initialize snap client object
const snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
} as snapOptions);

// prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
const parameter: SnapInterface.transactionRequest  = {
    "transaction_details": {
        "order_id": "test-transaction-123",
        "gross_amount": 200000
    },
    "credit_card": {
        "secure": true
    }
};

// create transaction
snap.createTransaction(parameter)
    .then((transaction: SnapInterface.response) => {
        // transaction token
        const transactionToken = transaction.token;
        console.log('transactionToken:', transactionToken);

        // transaction redirect url
        const transactionRedirectUrl = transaction.redirect_url;
        console.log('transactionRedirectUrl:', transactionRedirectUrl);
    })
    .catch((e: transactionError) => {
        console.log('Error occured:', e.message);
    });

// transaction is object representation of API JSON response
// sample:
// {
// 'redirect_url': 'https://app.sandbox.midtrans.com/snap/v2/vtweb/f0a2cbe7-dfb7-4114-88b9-1ecd89e90121', 
// 'token': 'f0a2cbe7-dfb7-4114-88b9-1ecd89e90121'
// }