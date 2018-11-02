const midtransClient = require('./../../index.js');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// initialize core api / snap client object
let apiClient = new midtransClient.Snap({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
});

let mockNotificationJson = {
    'currency': 'IDR',
    'fraud_status': 'accept',
    'gross_amount': '24145.00',
    'order_id': 'test-transaction-321',
    'payment_type': 'bank_transfer',
    'status_code': '201',
    'status_message': 'Success, Bank Transfer transaction is created',
    'transaction_id': '6ee793df-9b1d-4343-8eda-cc9663b4222f',
    'transaction_status': 'pending',
    'transaction_time': '2018-10-24 15:34:33',
    'va_numbers': [{'bank': 'bca', 'va_number': '490526303019299'}]
}

apiClient.transaction.notification(mockNotificationJson)
    .then((statusResponse)=>{
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // Sample transactionStatus handling logic

        if (transactionStatus == 'capture'){
            if (fraudStatus == 'challenge'){
                // TODO set transaction status on your databaase to 'challenge'
            } else if (fraudStatus == 'accept'){
                // TODO set transaction status on your databaase to 'success'
            }
        } else if (transactionStatus == 'cancel' ||
          transactionStatus == 'deny' ||
          transactionStatus == 'expire'){
          // TODO set transaction status on your databaase to 'failure'
        } else if (transactionStatus == 'pending'){
          // TODO set transaction status on your databaase to 'pending' / waiting payment
        }
    });