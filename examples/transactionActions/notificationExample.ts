import midtransClient, { NotificationInterface, snapOptions } from './../../index.js';
/**
 * import midtransClient from 'midtrans-client'; // use this if installed via NPM
 * 
 * If you want to import interface from typings, use:
 * 
 * import midtransClient, { NotificationInterface, snapOptions } from "midtrans-client";
 * */ 

// initialize core api / snap client object
const apiClient = new midtransClient.Snap({
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY',
    clientKey : 'YOUR_CLIENT_KEY'
} as snapOptions);

const mockNotificationJson: NotificationInterface.parameters = {
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
    'va_numbers': [
        {
            'bank': 'bca',
            'va_number': '490526303019299'
        }
    ]
}

apiClient.transaction.notification(mockNotificationJson)
    .then((statusResponse: NotificationInterface.response) => {
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // Sample transactionStatus handling logic

        if (transactionStatus == 'capture') {
            // capture only applies to card transaction, which you need to check for the fraudStatus
            if (fraudStatus == 'challenge') {
                // TODO set transaction status on your databaase to 'challenge'
            } else if (fraudStatus == 'accept') {
                // TODO set transaction status on your databaase to 'success'
            }
        } else if (transactionStatus == 'settlement') {
            // TODO set transaction status on your databaase to 'success'
        } else if (transactionStatus == 'deny') {
            // TODO you can ignore 'deny', because most of the time it allows payment retries
            // and later can become success
        } else if (transactionStatus == 'cancel' ||
          transactionStatus == 'expire') {
            // TODO set transaction status on your databaase to 'failure'
        } else if (transactionStatus == 'pending') {
            // TODO set transaction status on your databaase to 'pending' / waiting payment
        }
    });