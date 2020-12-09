/**
 * Before checking this file, please install typescript, @types/node and @types/express as your development dependencies.
 * 
 * $ npm install --save-dev typescript @types/node @types/express
 * or
 * $ yarn add typescript @types/node @types/express --dev
 * 
 */

import express, { Application, Request, Response } from 'express';
import midtransClient, { CoreApiInterface, coreApiOptions, NotificationInterface, SnapInterface, snapOptions, transactionError } from '../..';

/**
 * For production use, please refer to notes below:
 * 
 * import midtransClient, { CoreApiInterface, coreApiOptions, NotificationInterface, SnapInterface, transactionError } from "midtrans-client";
 * 
 */

// Express setup
const app: Application = express();
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); // to support URL-encoded POST body
app.use(express.json()); // to support parsing JSON POST body

/**
 * ===============
 * Using Snap API
 * ===============
 */

// Very simple Snap checkout
app.get('/simple_checkout', function (req: Request, res: Response) {
  // initialize snap client object
  const snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : 'SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA',
    clientKey : 'SB-Mid-client-61XuGAwQ8Bj8LxSS'
  } as snapOptions);

  const parameter: SnapInterface.transactionRequest = {
    "transaction_details": {
      "order_id": "order-id-node-" + Math.round((new Date()).getTime() / 1000),
     "gross_amount": 200000
    },
    "credit_card": {
      "secure": true
    }
  };

  // create snap transaction token
  snap.createTransactionToken(parameter)
    .then((transactionToken: string): void => {
        // pass transaction token to frontend
        res.render('simple_checkout', {
          token: transactionToken, 
          clientKey: snap.apiConfig.clientKey
        })
    })
})

/**
 * ===============
 * Using Core API - Credit Card
 * ===============
 */

// [0] Setup API client and config
const core = new midtransClient.CoreApi({
  isProduction : false,
  serverKey : 'SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA',
  clientKey : 'SB-Mid-client-61XuGAwQ8Bj8LxSS'
} as coreApiOptions);

// [1] Render HTML+JS web page to get card token_id and [3] 3DS authentication
app.get('/simple_core_api_checkout', function (req: Request, res: Response) {
  res.render('simple_core_api_checkout', { clientKey: core.apiConfig.clientKey })
})

// [2] Handle Core API credit card token_id charge
app.post('/charge_core_api_ajax', function (req: Request, res: Response) {
  console.log(`- Received charge request:`, req.body);
  core.charge({
    "payment_type": "credit_card",
    "transaction_details": {
      "gross_amount": 200000,
      "order_id": "order-id-node-" + Math.round((new Date()).getTime() / 1000),
    },
    "credit_card":{
      "token_id": req.body.token_id,
      "authentication": req.body.authenticate_3ds,
    }
  } as CoreApiInterface.transactionRequest)
  .then((apiResponse: Record<string, any>): void => {
    res.send(`${JSON.stringify(apiResponse, null, 2)}`)
  })
  .catch((err: transactionError): void => {
    res.send(`${JSON.stringify(err.message, null, 2)}`)
  })
})


// [4] Handle Core API check transaction status
app.post('/check_transaction_status', function (req: Request, res: Response) {
  console.log(`- Received check transaction status request:`, req.body);
  core.transaction.status(req.body.transaction_id)
    .then((transactionStatusObject: Record<string, any>): void => {
      const orderId = transactionStatusObject.order_id;
      const transactionStatus = transactionStatusObject.transaction_status;
      const fraudStatus = transactionStatusObject.fraud_status;

      const summary = `Transaction Result. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw transaction status:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;

      // [5.A] Handle transaction status on your backend
      // Sample transactionStatus handling logic
      if (transactionStatus == 'capture'){
          if (fraudStatus == 'challenge'){
              // TODO set transaction status on your databaase to 'challenge'
          } else if (fraudStatus == 'accept'){
              // TODO set transaction status on your databaase to 'success'
          }
      } else if (transactionStatus == 'settlement'){
        // TODO set transaction status on your databaase to 'success'
        // Note: Non card transaction will become 'settlement' on payment success
        // Credit card will also become 'settlement' D+1, which you can ignore
        // because most of the time 'capture' is enough to be considered as success
      } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire'){
        // TODO set transaction status on your databaase to 'failure'
      } else if (transactionStatus == 'pending'){
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      } else if (transactionStatus == 'refund'){
        // TODO set transaction status on your databaase to 'refund'
      }
      console.log(summary);
      res.send(JSON.stringify(transactionStatusObject, null, 2));
    });
})

/**
 * ===============
 * Handling HTTP Post Notification
 * ===============
 */

app.post('/notification_handler', function (req: Request, res: Response) {
  const receivedJson = req.body;
  core.transaction.notification(receivedJson)
    .then((transactionStatusObject: Record<string, any>): void => {
      const orderId = transactionStatusObject.order_id;
      const transactionStatus = transactionStatusObject.transaction_status;
      const fraudStatus = transactionStatusObject.fraud_status;

      const summary = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw notification object:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;

      // [5.B] Handle transaction status on your backend via notification alternatively
      // Sample transactionStatus handling logic
      if (transactionStatus == 'capture'){
          if (fraudStatus == 'challenge'){
              // TODO set transaction status on your databaase to 'challenge'
          } else if (fraudStatus == 'accept'){
              // TODO set transaction status on your databaase to 'success'
          }
      } else if (transactionStatus == 'settlement'){
        // TODO set transaction status on your databaase to 'success'
        // Note: Non-card transaction will become 'settlement' on payment success
        // Card transaction will also become 'settlement' D+1, which you can ignore
        // because most of the time 'capture' is enough to be considered as success
      } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire'){
        // TODO set transaction status on your databaase to 'failure'
      } else if (transactionStatus == 'pending'){
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      } else if (transactionStatus == 'refund'){
        // TODO set transaction status on your databaase to 'refund'
      }
      console.log(summary);
      res.send(summary);
    }).catch((error): void => {
      // TODO if error
      console.log(error)
    });
})

/**
 * ===============
 * Using Core API - other payment method, example: Permata VA
 * ===============
 */
app.get('/simple_core_api_checkout_permata', function (req: Request, res: Response) {
  console.log(`- Received charge request for Permata VA`);
  core.charge({
    "payment_type": "bank_transfer",
    "transaction_details": {
      "gross_amount": 200000,
      "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
    }
  })
  .then((apiResponse: Record<string, any>): void => {
    res.render('simple_core_api_checkout_permata', {
      vaNumber: apiResponse.permata_va_number,
      amount: apiResponse.gross_amount,
      orderId: apiResponse.order_id
    });
  })
})

/**
 * ===============
 * Run ExpressApp
 * ===============
 */
// homepage
app.get('/', function (req: Request, res: Response) {
  res.render('index');
})
// credit card frontend demo
app.get('/core_api_credit_card_frontend_sample', function (req: Request, res: Response) {
  res.render('core_api_credit_card_frontend_sample', { clientKey: core.apiConfig.clientKey });
})
app.listen(3000, () => console.log(`ExpressApp listening on localhost port 3000!`))