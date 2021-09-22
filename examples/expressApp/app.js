// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.

const express = require('express');
const midtransClient = require('midtrans-client');

// Set Your server key
// You can find it in Merchant Portal -> Settings -> Access keys
const SERVER_KEY = 'SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA';
const CLIENT_KEY = 'SB-Mid-client-61XuGAwQ8Bj8LxSS';

// Express setup
let app = express();
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
app.get('/simple_checkout', function (req, res) {
  // initialize snap client object
  let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : SERVER_KEY,
    clientKey : CLIENT_KEY
  });
  let parameter = {
    "transaction_details": {
      "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
      "gross_amount": 200000
    }, "credit_card":{
      "secure" : true
    }
  };
  // create snap transaction token
  snap.createTransactionToken(parameter)
    .then((transactionToken)=>{
        // pass transaction token to frontend
        res.render('simple_checkout',{
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
let core = new midtransClient.CoreApi({
  isProduction : false,
  serverKey : SERVER_KEY,
  clientKey : CLIENT_KEY
});

// [1] Render HTML+JS web page to get card token_id and [3] 3DS authentication
app.get('/simple_core_api_checkout', function (req, res) {
  res.render('simple_core_api_checkout',{ clientKey: core.apiConfig.clientKey })
})

// [2] Handle Core API credit card token_id charge
app.post('/charge_core_api_ajax', function (req, res) {
  console.log(`- Received charge request:`,req.body);
  core.charge({
    "payment_type": "credit_card",
    "transaction_details": {
      "gross_amount": 200000,
      "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
    },
    "credit_card":{
      "token_id": req.body.token_id,
      "authentication": req.body.authenticate_3ds,
    }
  })
  .then((apiResponse)=>{
    res.send(`${JSON.stringify(apiResponse, null, 2)}`)
  })
  .catch((err)=>{
    res.send(`${JSON.stringify(err.ApiResponse, null, 2)}`)
  })
})


// [4] Handle Core API check transaction status
app.post('/check_transaction_status', function(req, res){
  console.log(`- Received check transaction status request:`,req.body);
  core.transaction.status(req.body.transaction_id)
    .then((transactionStatusObject)=>{
      let orderId = transactionStatusObject.order_id;
      let transactionStatus = transactionStatusObject.transaction_status;
      let fraudStatus = transactionStatusObject.fraud_status;

      let summary = `Transaction Result. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw transaction status:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;

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

app.post('/notification_handler', function(req, res){
  let receivedJson = req.body;
  core.transaction.notification(receivedJson)
    .then((transactionStatusObject)=>{
      let orderId = transactionStatusObject.order_id;
      let transactionStatus = transactionStatusObject.transaction_status;
      let fraudStatus = transactionStatusObject.fraud_status;

      let summary = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw notification object:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;

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
    });
})

/**
 * ===============
 * Using Core API - other payment method, example: Permata VA
 * ===============
 */
app.get('/simple_core_api_checkout_permata', function (req, res) {
  console.log(`- Received charge request for Permata VA`);
  core.charge({
    "payment_type": "bank_transfer",
    "transaction_details": {
      "gross_amount": 200000,
      "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
    }
  })
  .then((apiResponse)=>{
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
app.get('/', function (req, res) {
  if (!SERVER_KEY || !CLIENT_KEY) {
    // non-relevant function only used for demo/example purpose
    res.send(printExampleWarningMessage());
  }
  res.render('index');
})

function printExampleWarningMessage() {
  message = "<code><h4>Please set your server key and client key from sandbox</h4>In file: " + __filename
  message += "<br><br>// Set Your server key"
  message += "<br>// You can find it in Merchant Portal -> Settings -> Access keys"
  message += "<br>SERVER_KEY = ''"
  message += "<br>CLIENT_KEY = ''</code>"
  return message
}

// credit card frontend demo
app.get('/core_api_credit_card_frontend_sample', function (req, res) {
  res.render('core_api_credit_card_frontend_sample',{ clientKey: core.apiConfig.clientKey });
})
app.listen(3000, () => console.log(`ExpressApp listening on localhost port 3000!`))
