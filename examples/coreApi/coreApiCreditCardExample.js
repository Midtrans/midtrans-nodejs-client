const midtransClient = require('./../../index.js');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.

// Initialize core api client object
// You can find it in Merchant Portal -> Settings -> Access keys
let core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
});

// Alternative way to initialize core api client object:
// let core = new midtransClient.CoreApi();
// core.apiConfig.set({
//     isProduction : false,
//     serverKey : 'YOUR_SERVER_KEY',
//     clientKey : 'YOUR_CLIENT_KEY'
// })

// Another alternative way to initialize core api client object:
// let core = new midtransClient.CoreApi();
// core.apiConfig.isProduction = false;
// core.apiConfig.serverKey = 'YOUR_SERVER_KEY';
// core.apiConfig.clientKey = 'YOUR_CLIENT_KEY';

// IMPORTANT NOTE: You should do credit card get token via frontend using `midtrans-new-3ds.min.js`, to avoid card data breach risks on your backend
// ( refer to: https://docs.midtrans.com/en/core-api/credit-card?id=_1-getting-the-card-token )
// For full example on Credit Card 3DS transaction refer to:
// (/examples/expressApp) that implement Snap & Core Api

// prepare CORE API parameter to get credit card token
// another sample of card number can refer to https://docs.midtrans.com/en/technical-reference/sandbox-test?id=card-payments
let parameter = {
    'card_number': '5264 2210 3887 4659',
    'card_exp_month': '12',
    'card_exp_year': '2025',
    'card_cvv': '123',
    'client_key': core.apiConfig.clientKey,
};
core.cardToken(parameter)
    .then((cardTokenResponse)=>{
        // prepare CORE API parameter to charge credit card ( refer to: https://docs.midtrans.com/en/core-api/credit-card?id=_2-sending-transaction-data-to-charge-api )
        let cardToken = cardTokenResponse.token_id;
        let parameter = {
            "payment_type": "credit_card",
            "transaction_details": {
                "gross_amount": 12145,
                "order_id": "test-transaction-54321",
            },
            "credit_card":{
                "token_id": cardToken
            }
        };

        return core.charge(parameter);
    })
    .then((chargeResponse)=>{
        console.log('chargeResponse:',JSON.stringify(chargeResponse));
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    });;

// charge_response is object representation of API JSON response
// sample:
// {
//     'approval_code': '1540370521462',
//     'bank': 'bni',
//     'card_type': 'debit',
//     'channel_response_code': '00',
//     'channel_response_message': 'Approved',
//     'currency': 'IDR',
//     'fraud_status': 'accept',
//     'gross_amount': '12145.00',
//     'masked_card': '526422-4659',
//     'order_id': 'test-transaction-54321',
//     'payment_type': 'credit_card',
//     'status_code': '200',
//     'status_message': 'Success, Credit Card transaction is successful',
//     'transaction_id': '2bc57149-b52b-46ff-b901-86418ad1abcc',
//     'transaction_status': 'capture',
//     'transaction_time': '2018-10-24 15:42:01'
// }