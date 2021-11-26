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

// To use API subscription for gopay, you should first link your customer gopay account with gopay tokenization
// Refer to this docs: https://api-docs.midtrans.com/#gopay-tokenization

// You will receive gopay payment token using `get_payment_account` API call.
// You can see some Tokenization API examples here (examples/tokenization)
// {
//     "status_code": "200",
//     "payment_type": "gopay",
//     "account_id": "aa211a53-3d39-426e-a191-0bb078923526",
//     "account_status": "ENABLED",
//     "metadata": {
//     "payment_options": [{
//         "name": "GOPAY_WALLET",
//         "active": true,
//         "balance": {
//             "value": "8000000.00",
//             "currency": "IDR"
//         },
//         "metadata": {},
//         "token": "2fda0635-bac6-4a7a-bce8-91d87444ab80"
//     },
//         {
//             "name": "PAY_LATER",
//             "active": true,
//             "balance": {
//                 "value": "8000000.00",
//                 "currency": "IDR"
//             },
//             "metadata": {},
//             "token": "43ceb007-b0cf-4f11-8b9f-229cfc7474fc"
//         }
//     ]
// }
// }
// Sample gopay payment option token and gopay account id for testing purpose that has been already activated before
let gopayPaymentOptionToken = '2fda0635-bac6-4a7a-bce8-91d87444ab80'
let gopayAccountId = 'aa211a53-3d39-426e-a191-0bb078923526'


// prepare CORE API parameter ( refer to: https://api-docs.midtrans.com/#create-subscription ) create subscription parameter example
let parameter = {
    "name": "SUBS-Gopay-2021",
    "amount": "10000",
    "currency": "IDR",
    "payment_type": "gopay",
    "token": gopayPaymentOptionToken,
    "schedule": {
        "interval": 1,
        "interval_unit": "day",
        "max_interval": 7
    },
    "metadata": {
        "description": "Recurring payment for A"
    },
    "customer_details": {
        "first_name": "John A",
        "last_name": "Doe A",
        "email": "johndoe@email.com",
        "phone": "+62812345678"
    },
    "gopay": {
        "account_id": gopayAccountId
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
//     "id": "ca67e11f-3c38-4026-9e04-53b1f277d1a0",
//     "name": "SUBS-Gopay-2021",
//     "amount": "10000",
//     "currency": "IDR",
//     "created_at": "2021-11-18 13:16:15",
//     "schedule": {
//     "interval": 1,
//         "current_interval": 0,
//         "max_interval": 7,
//         "interval_unit": "day",
//         "start_time": "2021-11-18 13:16:15",
//         "previous_execution_at": "2021-11-18 13:16:15",
//         "next_execution_at": "2021-11-19 13:16:15"
// },
//     "status": "active",
//     "token": "2fda0635-bac6-4a7a-bce8-91d87444ab80",
//     "payment_type": "gopay",
//     "transaction_ids": [],
//     "metadata": {
//     "description": "Recurring payment for A"
// },
//     "customer_details": {
//     "email": "johndoe@email.com",
//         "first_name": "John A",
//         "last_name": "Doe A",
//         "phone": "+62812345678"
// }
// }

// Sample active subscription id for testing purpose
let subscriptionId = "ca67e11f-3c38-4026-9e04-53b1f277d1a0"

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
    "token": gopayPaymentOptionToken,
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
