import midtransClient, { CoreApiInterface, coreApiOptions } from './../../index.js';
/**
 * If the package is installed via NPM / Yarn, use this instead:
 * 
 *  import midtransClient from 'midtrans-client';
 * 
 * If you want to import interface from typings, use:
 * 
 *  import midtransClient, { CoreApiInterface, coreApiOptions } from "midtrans-client";
 * 
 * */ 

// initialize core api client object
const core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
} as coreApiOptions);

// prepare Core API parameter ( refer to: https://api-docs.midtrans.com ) minimum parameter example:
const parameter: CoreApiInterface.transactionRequest = {
    "payment_type": "bank_transfer",
    "transaction_details": {
        "gross_amount": 24145,
        "order_id": "test-transaction-321",
    },
    "bank_transfer":{
        "bank": "bni"
    }
};
core.charge(parameter)
    .then((chargeResponse) => {
        console.log('chargeResponse:', JSON.stringify(chargeResponse));
    })
    .catch((e) => {
        console.log('Error occured:', e.message);
    });

// charge_response is dictionary representation of API JSON response
// sample:
// {
//     'currency': 'IDR',
//     'fraud_status': 'accept',
//     'gross_amount': '24145.00',
//     'order_id': 'test-transaction-321',
//     'payment_type': 'bank_transfer',
//     'status_code': '201',
//     'status_message': 'Success, Bank Transfer transaction is created',
//     'transaction_id': '6ee793df-9b1d-4343-8eda-cc9663b4222f',
//     'transaction_status': 'pending',
//     'transaction_time': '2018-10-24 15:34:33',
//     'va_numbers': [{'bank': 'bca', 'va_number': '490526303019299'}]
// }