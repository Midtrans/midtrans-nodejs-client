const express = require('express');
const midtransClient = require('midtrans-client');

// Express setup
let app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies

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

app.post('/process_core_api', function (req, res) {
  core.charge({
    "payment_type": "credit_card",
    "transaction_details": {
      "gross_amount": 200000,
      "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
    },
    "credit_card":{
      "token_id": req.body.token_id
    }
  })
  .then((apiResponse)=>{
    res.send(`API response:<br><pre>${JSON.stringify(apiResponse, null, 2)}</pre>`)
  })
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