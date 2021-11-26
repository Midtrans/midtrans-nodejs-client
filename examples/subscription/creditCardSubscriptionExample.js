const midtransClient = require('../../index.js');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.

// Initialize core api client object
// You can find it in Merchant Portal -> Settings -> Access keys
let core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
});

// To use API subscription for credit card, you should first obtain the 1 click token
// Refer to this docs: https://docs.midtrans.com/en/core-api/advanced-features?id=recurring-transaction-with-subscriptions-api

// You will receive saved_token_id as part of the response when the initial card payment is accepted (will also available in the HTTP notification's JSON)
// Refer to this docs: https://docs.midtrans.com/en/core-api/advanced-features?id=sample-3ds-authenticate-json-response-for-the-first-transaction
// {
//  ..
//  "status_code": "200",
//  "signature_key": "99bc6101abcda11c17a8d401747d1fdfb6085af88daf94c575aeaab79487b4b5534a7b5cc898314e5386c0def86f6f7676079bdb656362c5ccd2c9906b42e5a3",
//  "saved_token_id_expired_at": "2021-12-31 07:00:00",
//  "saved_token_id": "521111gmWqMegyejqCQmmopnCFRs1117",
//  "payment_type": "credit_card"
//  ..
// }
// Sample saved token id for testing purpose
let savedTokenId = '521111gmWqMegyejqCQmmopnCFRs1117'


// prepare CORE API parameter ( refer to: https://api-docs.midtrans.com/#create-subscription ) create subscription parameter example
let parameter = {
    "name": "MONTHLY_2021",
    "amount": "14000",
    "currency": "IDR",
    "payment_type": "credit_card",
    "token": savedTokenId,
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
    .then((Response) => {
        console.log('createSubscription Response:', JSON.stringify(Response));
    })
    .catch((e) => {
        console.log('createSubscription Error message:', e.message);
    });
// sample response is dictionary representation of API JSON response
// {
//     "id": "537d04c6-eef7-4c07-a65c-11c55f92c7ed",
//     "name": "MONTHLY_2021",
//     "amount": "14000",
//     "currency": "IDR",
//     "created_at": "2021-11-18 12:14:09",
//     "schedule": {
//     "interval": 1,
//         "current_interval": 0,
//         "max_interval": 12,
//         "interval_unit": "month",
//         "start_time": "2021-11-25 07:25:01",
//         "next_execution_at": "2021-11-25 07:25:01"
// },
//     "status": "active",
//     "token": "521111gmWqMegyejqCQmmopnCFRs1117",
//     "payment_type": "credit_card",
//     "transaction_ids": [],
//     "metadata": {
//     "description": "Recurring payment for A"
// },
//     "customer_details": {
//     "email": "johndoe@email.com",
//         "first_name": "John",
//         "last_name": "Doe",
//         "phone": "+62812345678"
// }
// }

// Sample active subscription id for testing purpose
let subscriptionId = "537d04c6-eef7-4c07-a65c-11c55f92c7ed"

// get subscription by subscriptionId
core.getSubscription(subscriptionId)
    .then((Response) => {
        console.log('getSubscription Response:', JSON.stringify(Response));
    })
    .catch((e) => {
        console.log('getSubscription Error message:', e.message);
    });

// enable subscription by subscriptionId
core.enableSubscription(subscriptionId)
    .then((Response) => {
        console.log('enableSubscription Response:', JSON.stringify(Response));
    })
    .catch((e) => {
        console.log('enableSubscription Error message:', e.message);
    });

// update subscription by subscriptionId and Param
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
    .then((Response) => {
        console.log('updateSubscription Response:', JSON.stringify(Response));
    })
    .catch((e) => {
        console.log('updateSubscription Error message:', e.message);
    });

// disable subscription by subscriptionId
core.disableSubscription(subscriptionId)
    .then((Response) => {
        console.log('disableSubscription Response:', JSON.stringify(Response));
    })
    .catch((e) => {
        console.log('disableSubscription Error message:', e.message);
    });
