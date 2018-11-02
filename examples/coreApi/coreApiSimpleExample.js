const midtransClient = require('./../../index.js');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// initialize core api client object
let core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
});

// prepare Core API parameter ( refer to: https://api-docs.midtrans.com ) minimum parameter example:
let parameter = {
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
    .then((chargeResponse)=>{
        console.log('chargeResponse:',JSON.stringify(chargeResponse));
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    });;

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