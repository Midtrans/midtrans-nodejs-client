const express = require('express');
const midtransClient = require('midtrans-client');

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
    serverKey : 'SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA',
    clientKey : 'SB-Mid-client-61XuGAwQ8Bj8LxSS'
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
 * Using Core API
 * ===============
 */

let core = new midtransClient.CoreApi({
  isProduction : false,
  serverKey : 'SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA',
  clientKey : 'SB-Mid-client-61XuGAwQ8Bj8LxSS'
});

app.get('/simple_core_api_checkout', function (req, res) {
  res.render('simple_core_api_checkout',{ clientKey: core.apiConfig.clientKey })
})

app.post('/charge_core_api_ajax', function (req, res) {
  console.log(`- Received charge request:`,req.body);
  console.log(req.body.authenticate_3ds);
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
})


// Handle Core API check transaction status
app.post('/check_transaction_status', function(req, res){
  console.log(`- Received check transaction status request:`,req.body);
  core.transaction.status(req.body.transaction_id)
    .then((transactionStatusObject)=>{
      let orderId = transactionStatusObject.order_id;
      let transactionStatus = transactionStatusObject.transaction_status;
      let fraudStatus = transactionStatusObject.fraud_status;

      let summary = `Transaction Result. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw transaction status:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;

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
      console.log(summary);
      res.send(summary);
    });
})

/**
 * ===============
 * Run ExpressApp
 * ===============
 */
// homepage
app.get('/', function (req, res) {
  res.render('index');
})
app.listen(3000, () => console.log(`ExpressApp listening on localhost port 3000!`))