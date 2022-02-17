'use strict';

const expect = require('chai').expect;
const midtransClient = require('./../index.js');
const CoreApi = midtransClient.CoreApi;
const cons = require('./sharedConstants');

let tokenId = '';
let savedTokenId = '';
let reuseOrderId = [
  "node-midtransclient-test1-"+generateTimestamp(),
  "node-midtransclient-test2-"+generateTimestamp(),
  "node-midtransclient-test3-"+generateTimestamp(),
];
let apiResponse = {};

describe('CoreApi.js',()=> {

  it('able to start test',()=>{
    expect(true).to.be.true
  })

  it('class should be working',()=>{
    let core = new CoreApi();
    expect(core instanceof CoreApi).to.be.true;
    expect(typeof(core.charge)).to.be.equal('function');
    expect(typeof(core.capture)).to.be.equal('function');
    expect(typeof(core.cardRegister)).to.be.equal('function');
    expect(typeof(core.cardToken)).to.be.equal('function');
    expect(typeof(core.cardPointInquiry)).to.be.equal('function');
    expect(core.apiConfig.get().serverKey).to.be.a('string');
    expect(core.apiConfig.get().clientKey).to.be.a('string');
  })

  it('able to get cc token',()=>{
    let core = new CoreApi(generateConfig());
    return core.cardToken({
        'card_number': '5264 2210 3887 4659',
        'card_exp_month': '12',
        'card_exp_year': ((new Date).getFullYear()+1)+'',
        'card_cvv': '123',
        'client_key': core.apiConfig.get().clientKey,
    })
      .then((res)=>{
        expect(res.status_code).to.be.a('string');
        expect(res.status_code).to.be.equals('200');
        expect(res.token_id).to.be.a('string');
        tokenId = res.token_id;
      })

  })

  it('able to card register cc',()=>{
    let core = new CoreApi(generateConfig());
    return core.cardRegister({
        'card_number': '4811 1111 1111 1114',
        'card_exp_month': '12',
        'card_exp_year': ((new Date).getFullYear()+1)+'',
        'card_cvv': '123',
        'client_key': core.apiConfig.get().clientKey,
    })
      .then((res)=>{
        expect(res.status_code).to.be.a('string');
        expect(res.status_code).to.be.equals('200');
        expect(res.saved_token_id).to.be.a('string');
        savedTokenId = res.saved_token_id;
      })

  })

  it('fail to card point inquiry 402',()=>{
    let core = new CoreApi(generateConfig());
    return core.cardPointInquiry(tokenId)
      .catch((e)=>{
        expect(e.message).to.includes('402');
      })

  })

  it('able to charge cc simple',()=>{
    let core = new CoreApi(generateConfig());
    let parameter = generateCCParamMin(reuseOrderId[1],tokenId);
    return core.charge(parameter)
      .then((res)=>{
        expect(res.status_code).to.be.equals('200');
        expect(res.transaction_status).to.be.equals('capture');
        expect(res.fraud_status).to.be.equals('accept');
      })
  })

  it('able to charge cc one click',()=>{
    let core = new CoreApi(generateConfig());
    let parameter = generateCCParamMin(reuseOrderId[2],savedTokenId);
    return core.charge(parameter)
      .then((res)=>{
        expect(res.status_code).to.be.equals('200');
        expect(res.transaction_status).to.be.equals('capture');
        expect(res.fraud_status).to.be.equals('accept');
      })
  })

  it('able to charge bank transfer BCA VA simple',()=>{
    let core = new CoreApi(generateConfig());
    return core.charge(generateParamMin(reuseOrderId[0]))
      .then((res)=>{
        expect(res.status_code).to.be.a('string');
        expect(res.status_code).to.be.equals('201');
        expect(res.transaction_status).to.be.a('string');
        expect(res.transaction_status).to.be.equals('pending');
      })

  })

  it('able to status',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.status(reuseOrderId[0])
      .then((res)=>{
        apiResponse = res;
        expect(res.status_code).to.be.equals('201');
        expect(res.transaction_status).to.be.equals('pending');
      })

  })

  // TODO test statusb2b

  it('able to notification from object',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.notification(apiResponse)
      .then((res)=>{
        expect(res.status_code).to.be.equals('201');
        expect(res.transaction_status).to.be.equals('pending');
      })
  })

  it('able to notification from json string',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.notification(JSON.stringify(apiResponse))
      .then((res)=>{
        expect(res.status_code).to.be.equals('201');
        expect(res.transaction_status).to.be.equals('pending');
      })
  })

  it('able to throw exception notification from empty string',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.notification('')
      .catch((e)=>{
        expect(e.message).to.includes('fail to parse');
      })
  })

  it('able to expire',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.expire(reuseOrderId[0])
      .then((res)=>{
        expect(res.status_code).to.be.equals('407');
        expect(res.transaction_status).to.be.equals('expire');
      })
  })

  it('fail to approve transaction that cannot be updated',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.approve(reuseOrderId[1])
      .catch((e)=>{
        expect(e.message).to.includes('412');
      })
  })

  it('fail to deny transaction that cannot be updated',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.deny(reuseOrderId[1])
      .catch((e)=>{
        expect(e.message).to.includes('412');
      })
  })

  it('able to cancel',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.cancel(reuseOrderId[1])
      .then((res)=>{
        expect(res.status_code).to.equals('200');
        expect(res.transaction_status).to.includes('cancel');
      })
  })

  it('fail to refund non settlement transaction',()=>{
    let core = new CoreApi(generateConfig());
    let parameter = {
      "amount": 5000,
      "reason": "for some reason"
    }
    return core.transaction.refund(reuseOrderId[2],parameter)
      .catch((e)=>{
        expect(e.message).to.includes('412');
      })
  })

  it('fail to direct refund non settlement transaction',()=>{
    let core = new CoreApi(generateConfig());
    let parameter = {
      "amount": 5000,
      "reason": "for some reason"
    }
    return core.transaction.refundDirect(reuseOrderId[2],parameter)
      .catch((e)=>{
        expect(e.message).to.includes('412');
      })
  })

  it('fail to status 404 non exists transaction',()=>{
    let core = new CoreApi(generateConfig());
    return core.transaction.status('non-exists-transaction')
      .catch((e)=>{
        expect(e.message).to.includes('404');
      })
  })

  it('able to re-set serverKey via setter',()=>{
    let core = new CoreApi({clientKey:'abc'});
    expect(core.apiConfig.get().serverKey).to.be.equals('');
    expect(core.apiConfig.get().clientKey).to.be.equals('abc');
    expect(core.apiConfig.get().isProduction).to.be.false;
    core.apiConfig.set({serverKey:cons.serverKey});
    expect(core.apiConfig.get().serverKey).to.be.equals(cons.serverKey);
    expect(core.apiConfig.get().clientKey).to.be.equals('abc');
    expect(core.apiConfig.get().isProduction).to.be.false;
  })

  it('able to re-set serverKey via property',()=>{
    let core = new CoreApi({clientKey:'abc'});
    expect(core.apiConfig.get().serverKey).to.be.equals('');
    expect(core.apiConfig.get().clientKey).to.be.equals('abc');
    expect(core.apiConfig.get().isProduction).to.be.false;
    core.apiConfig.serverKey = cons.serverKey;
    expect(core.apiConfig.get().serverKey).to.be.equals(cons.serverKey);
    expect(core.apiConfig.get().clientKey).to.be.equals('abc');
    expect(core.apiConfig.get().isProduction).to.be.false;
  })

  it('fail to charge 401 with no serverKey',()=>{
    let core = new CoreApi(generateConfig());
    core.apiConfig.serverKey = null;
    return core.charge(generateParamMin())
      .catch((e)=>{
        expect(e.message).to.includes('401');
      })
  })

  it('fail to charge error with empty param',()=>{
    let core = new CoreApi(generateConfig());
    return core.charge()
      .catch((e)=>{
        expect(e.message).to.satisfy((message)=>{
          if(message.includes('400') || message.includes('error')){
            return true;
          }
          return false;
        });
      })
  })

  it('fail to charge 400 with zero gross_amount',()=>{
    let core = new CoreApi(generateConfig());
    let parameter = generateParamMin();
    parameter.transaction_details.gross_amount=0;
    return core.charge(parameter)
      .catch((e)=>{
        expect(e.message).to.includes('400');
      })
  })

  it('able to throw custom MidtransError',()=>{
    let core = new CoreApi(generateConfig());
    let parameter = generateParamMin();
    parameter.transaction_details.gross_amount=0;
    return core.charge(parameter)
      .catch((e)=>{
        expect(e.message).to.includes('400');
        expect(e.httpStatusCode).to.equals(400);
        expect(e.ApiResponse).to.be.an('object');
        expect(e.ApiResponse.validation_messages).to.be.an('array');
        expect(e.rawHttpClientData).to.be.an('object');
        expect(e.rawHttpClientData).to.have.property('data');
      })
  })

    it('able to create pay account',()=>{
        let core = new CoreApi(generateConfig());
        let parameter = generateParamGopayToken();
        return core.linkPaymentAccount(parameter)
            .then((res)=>{
                expect(res.status_code).to.be.equals('201');
                expect(res.account_status).to.be.equals('PENDING');
            })
    })

    it('able to get pay account',async () => {
        let core = new CoreApi(generateConfig());
        let parameter = generateParamGopayToken();
        let response = await core.linkPaymentAccount(parameter)
        let accountId = response.account_id;
        return core.getPaymentAccount(accountId)
            .then((res) => {
                expect(res.status_code).to.be.equals('201');
                expect(res.account_status).to.be.equals('PENDING');
            })
    })

    // expected the API call will fail because of not click activation from linkPaymentAccount
    it('able to unlink pay account',async () => {
        let core = new CoreApi(generateConfig());
        let parameter = generateParamGopayToken();
        let response = await core.linkPaymentAccount(parameter)
        let accountId = response.account_id;
        return core.unlinkPaymentAccount(accountId)
            .catch((e)=>{
                expect(e.message).to.includes('412');
                expect(e.httpStatusCode).to.equals('412');
            })
    })

    it('fail to get pay account with dummy id',()=>{
        let core = new CoreApi(generateConfig());
        return core.getPaymentAccount("dummy")
            .catch((e)=>{
                expect(e.message).to.includes('404');
                expect(e.httpStatusCode).to.equals('404');
            })
    })

    it('fail to unlink pay account with dummy id',()=>{
        let core = new CoreApi(generateConfig());
        return core.unlinkPaymentAccount("dummy")
            .catch((e)=>{
                expect(e.message).to.includes('404');
                expect(e.httpStatusCode).to.equals('404');
            })
    })

    it('able to create subscription',()=>{
        let core = new CoreApi(generateConfig());
        let parameter = generateParamCardSubscription();
        return core.createSubscription(parameter)
            .then((res)=>{
                expect(res.status).to.be.equals('active');
            })
    })

    it('able to get subscription',async () => {
        let core = new CoreApi(generateConfig());
        let parameter = generateParamCardSubscription();
        let response = await core.createSubscription(parameter)
        let subscriptionId = response.id;
        return core.getSubscription(subscriptionId)
            .then((res) => {
                expect(res.status).to.be.equals('active');
            })
    })

    it('able to disable subscription',async () => {
        let core = new CoreApi(generateConfig());
        let parameter = generateParamCardSubscription();
        let response = await core.createSubscription(parameter)
        let subscriptionId = response.id;
        return core.disableSubscription(subscriptionId)
            .then((res) => {
                expect(res.status_message).to.be.equals('Subscription is updated.');
            })
    })

    it('able to enable subscription',async () => {
        let core = new CoreApi(generateConfig());
        let parameter = generateParamCardSubscription();
        let response = await core.createSubscription(parameter)
        let subscriptionId = response.id;
        return core.enableSubscription(subscriptionId)
            .then((res) => {
                expect(res.status_message).to.be.equals('Subscription is updated.');
            })
        // disable subscription to prevent Core API continue to execute subscription
        let disable = await core.disableSubscription(subscriptionId)
    })

    it('able to update subscription',async () => {
        let core = new CoreApi(generateConfig());
        let parameter = generateParamCardSubscription();
        let response = await core.createSubscription(parameter)
        let subscriptionId = response.id;
        let parameter2 = generateParamUpdateSubscription()
        return core.updateSubscription(subscriptionId, parameter2)
            .then((res) => {
                expect(res.status_message).to.be.equals('Subscription is updated.');
            })
    })

    it('fail to get subscription with dummy subscription id',()=>{
        let core = new CoreApi(generateConfig());
        return core.getSubscription("dummy")
            .catch((e)=>{
                expect(e.message).to.includes("Subscription doesn't exist.");
                expect(e.httpStatusCode).to.equals(404);
            })
    })

    it('fail to disable subscription with dummy subscription id',()=>{
        let core = new CoreApi(generateConfig());
        return core.disableSubscription("dummy")
            .catch((e)=>{
                expect(e.message).to.includes("Subscription doesn't exist.");
                expect(e.httpStatusCode).to.equals(404);
            })
    })

    it('fail to enable subscription with dummy subscription id',()=>{
        let core = new CoreApi(generateConfig());
        return core.enableSubscription("dummy")
            .catch((e)=>{
                expect(e.message).to.includes("Subscription doesn't exist.");
                expect(e.httpStatusCode).to.equals(404);
            })
    })

    it('fail to update subscription with dummy subscription id',()=>{
        let core = new CoreApi(generateConfig());
        return core.updateSubscription("dummy")
            .catch((e)=>{
                expect(e.message).to.includes("Subscription doesn't exist.");
                expect(e.httpStatusCode).to.equals(404);
            })
    })

})

/**
 * Helper functions
 */

function generateTimestamp(devider=1){
  return Math.round((new Date()).getTime() / devider);
}

function generateConfig(){
  return {
    isProduction: false,
    serverKey: cons.serverKey,
    clientKey: cons.clientKey
  }
}

function generateParamMin(orderId=null){
  return {
      "payment_type": "bank_transfer",
      "transaction_details": {
          "gross_amount": 44145,
          "order_id": orderId == null ? "node-midtransclient-test-"+generateTimestamp() : orderId,
      },
      "bank_transfer":{
          "bank": "bca"
      }
  }
}

function generateParamGopayToken(){
    return {
        "payment_type": "gopay",
        "gopay_partner": {
            "phone_number": "81212345678",
            "country_code": "62",
            "redirect_url": "https://mywebstore.com/gopay-linking-finish"
        }
    }
}

function generateParamCardSubscription() {
    return {
        "name": "MONTHLY_2021",
        "amount": "14000",
        "currency": "IDR",
        "payment_type": "credit_card",
        "token": "481111DasKBLCCXbuKfEbVlFiBZr1114",
        "schedule": {
            "interval": 1,
            "interval_unit": "month",
            "max_interval": 12,
            "start_time": getFormattedTime(1000 * 60 * 60 * 24 * 2) // current time +2 days
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
    }
}

function generateParamUpdateSubscription() {
    return {
        "name": "MONTHLY_2021",
        "amount": "300000",
        "currency": "IDR",
        "token": "481111DasKBLCCXbuKfEbVlFiBZr1114",
        "schedule": {
            "interval": 1
        }
    }
}

function generateCCParamMin(orderId=null,tokenId=null){
  return {
      "payment_type": "credit_card",
      "transaction_details": {
          "gross_amount": 12145,
          "order_id": orderId == null ? "node-midtransclient-test-"+generateTimestamp() : orderId,
      },
      "credit_card":{
          "token_id": tokenId
      }
  }
}

function generateParamMax(){
  return {
    "transaction_details": {
      "order_id": "node-midtransclient-test-"+generateTimestamp(),
      "gross_amount": 10000
    },
    "item_details": [{
      "id": "ITEM1",
      "price": 10000,
      "quantity": 1,
      "name": "Midtrans Bear",
      "brand": "Midtrans",
      "category": "Toys",
      "merchant_name": "Midtrans"
    }],
    "customer_details": {
      "first_name": "John",
      "last_name": "Watson",
      "email": "test@example.com",
      "phone": "+628123456",
      "billing_address": {
        "first_name": "John",
        "last_name": "Watson",
        "email": "test@example.com",
        "phone": "081 2233 44-55",
        "address": "Sudirman",
        "city": "Jakarta",
        "postal_code": "12190",
        "country_code": "IDN"
      },
      "shipping_address": {
        "first_name": "John",
        "last_name": "Watson",
        "email": "test@example.com",
        "phone": "0 8128-75 7-9338",
        "address": "Sudirman",
        "city": "Jakarta",
        "postal_code": "12190",
        "country_code": "IDN"
      }
    },
    "enabled_payments": ["credit_card", "mandiri_clickpay", "cimb_clicks","bca_klikbca", "bca_klikpay", "bri_epay", "echannel", "indosat_dompetku","mandiri_ecash", "permata_va", "bca_va", "bni_va", "other_va", "gopay","kioson", "indomaret", "gci", "danamon_online"],
    "credit_card": {
      "secure": true,
      "channel": "migs",
      "bank": "bca",
      "installment": {
        "required": false,
        "terms": {
          "bni": [3, 6, 12],
          "mandiri": [3, 6, 12],
          "cimb": [3],
          "bca": [3, 6, 12],
          "offline": [6, 12]
        }
      },
      "whitelist_bins": [
        "48111111",
        "41111111"
      ]
    },
    "bca_va": {
      "va_number": "12345678911",
      "free_text": {
        "inquiry": [
          {
            "en": "text in English",
            "id": "text in Bahasa Indonesia"
          }
        ],
        "payment": [
          {
            "en": "text in English",
            "id": "text in Bahasa Indonesia"
          }
        ]
      }
    },
    "bni_va": {
      "va_number": "12345678"
    },
    "permata_va": {
      "va_number": "1234567890",
      "recipient_name": "SUDARSONO"
    },
    "callbacks": {
      "finish": "https://demo.midtrans.com"
    },
    "expiry": {
      "start_time": getFormattedTime(1000 * 60 * 60 * 24), // current time +24hrs
      "unit": "minutes",
      "duration": 1
    },
    "custom_field1": "custom field 1 content",
    "custom_field2": "custom field 2 content",
    "custom_field3": "custom field 3 content"
  }
}

function getFormattedTime(offsetInMilisecond = 0) {
  let targetDate = new Date(Date.now() + offsetInMilisecond);
  // formatted according to API param spec
  let formattedDateString = targetDate
    .toISOString()
    .split('T')
    .join(' ')
    .split('.')[0]
    +' +0000';
  return formattedDateString;
}
