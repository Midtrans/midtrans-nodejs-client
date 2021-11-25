const midtransClient = require('../../index.js');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.

// Initialize core api client object
// You can find it in Merchant Portal -> Settings -> Access keys
let core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
});

// prepare CORE API parameter ( refer to: https://api-docs.midtrans.com/#create-pay-account ) create pay charge parameter example
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
    .then((Response)=>{
        console.log('Response:',JSON.stringify(Response));
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    });

// link_payment_account_response is dictionary representation of API JSON response
// sample response :
// {
//     "status_code": "201",
//     "payment_type": "gopay",
//     "account_id": "f4b02398-dabd-4619-b9be-576925c1a50a",
//     "account_status": "PENDING",
//     "actions": [{
//     "name": "activation-deeplink",
//     "method": "GET",
//     "url": "https://api.sandbox.midtrans.com/v2/pay/account/gpar_c38689bc-676c-4a2c-be33-1751e70e37f3/link"
// }, {
//     "name": "activation-link-url",
//     "method": "GET",
//     "url": "https://api.sandbox.midtrans.com/v2/pay/account/gpar_c38689bc-676c-4a2c-be33-1751e70e37f3/link"
// }, {
//     "name": "activation-link-app",
//     "method": "GET",
//     "url": "https://simulator.sandbox.midtrans.com/gopay/partner/web/otp?id=eee6996d-e469-4367-9385-e122f9b60173"
// }],
//     "metadata": {
//     "reference_id": "3b151ddd-06c5-4248-aded-70b43228a030"
// }
// }
// for the first link, the account status is PENDING, you must activate it by accessing one of the URLs on the actions object

// Sample active account id for testing purpose
let activeAccountId = "f4b02398-dabd-4619-b9be-576925c1a50a"

// Get payment account by account id
core.getPaymentAccount(activeAccountId)
    .then((Response)=>{
        console.log('Response:',JSON.stringify(Response));
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    });
// sample response :
// {
//     "status_code": "200",
//     "payment_type": "gopay",
//     "account_id": "f4b02398-dabd-4619-b9be-576925c1a50a",
//     "account_status": "ENABLED",
//     "metadata": {
//     "payment_options": [{
//         "name": "PAY_LATER",
//         "active": true,
//         "balance": {
//             "value": "8000000.00",
//             "currency": "IDR"
//         },
//         "metadata": {},
//         "token": "235c3906-701d-4b73-a50b-f61cb6ac7b3b"
//     }, {
//         "name": "GOPAY_WALLET",
//         "active": true,
//         "balance": {
//             "value": "8000000.00",
//             "currency": "IDR"
//         },
//         "metadata": {},
//         "token": "ba42566b-a04b-4757-918e-428a9b222195"
//     }]
// }
// } {
//     "status_code": "200",
//         "payment_type": "gopay",
//         "account_id": "f4b02398-dabd-4619-b9be-576925c1a50a",
//         "account_status": "ENABLED",
//         "metadata": {
//         "payment_options": [{
//             "name": "PAY_LATER",
//             "active": true,
//             "balance": {
//                 "value": "8000000.00",
//                 "currency": "IDR"
//             },
//             "metadata": {},
//             "token": "235c3906-701d-4b73-a50b-f61cb6ac7b3b"
//         }, {
//             "name": "GOPAY_WALLET",
//             "active": true,
//             "balance": {
//                 "value": "8000000.00",
//                 "currency": "IDR"
//             },
//             "metadata": {},
//             "token": "ba42566b-a04b-4757-918e-428a9b222195"
//         }]
//     }
// }

function generateTimestamp(devider=1){
    return Math.round((new Date()).getTime() / devider);
}

// request charge
let params = {
    "payment_type": "gopay",
    "gopay": {
        "account_id": activeAccountId,
        "payment_option_token": "ba42566b-a04b-4757-918e-428a9b222195",
        "callback_url": "https://mywebstore.com/gopay-linking-finish"
    },
    "transaction_details": {
        "gross_amount": 10000,
        "order_id": "Gopaylink-sample-"+generateTimestamp()
    }
}

core.charge(params)
    .then((chargeResponse)=>{
        console.log('chargeResponse:',JSON.stringify(chargeResponse));
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    })
// sample response :
// {
//     "status_code": "200",
//     "status_message": "Success, GoPay transaction is successful",
//     "transaction_id": "9bc130ac-5a9e-4bb2-8b21-f2e0a1518804",
//     "order_id": "Gopaylink-sample-1637143806644",
//     "merchant_id": "G094279605",
//     "gross_amount": "10000.00",
//     "currency": "IDR",
//     "payment_type": "gopay",
//     "transaction_time": "2021-11-17 17:10:06",
//     "transaction_status": "settlement",
//     "fraud_status": "accept",
//     "settlement_time": "2021-11-17 17:10:06"
// }

// unlink payment account by accountId
// when account status still PENDING, you will get status code 412
// sample response :
// {
//     "status_code": "412",
//     "status_message": "Account status cannot be updated.",
//     "id": "358fdb22-1be2-4e6d-888d-b6703d60af6e"
// }
core.unlinkPaymentAccount(activeAccountId)
    .then((Response)=>{
        console.log('Response:',JSON.stringify(Response));
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    })