'use strict';
// @TODO continue and create thorough test for IRIS

const expect = require('chai').expect;
const midtransClient = require('./../index.js');
const Iris = midtransClient.Iris;
const cons = require('./sharedConstants');

describe('Iris.js',()=> {

  it('able to start test',()=>{
    expect(true).to.be.true
  })

  it('class should be working',()=>{
    let iris = new Iris();
    expect(iris instanceof Iris).to.be.true;
    expect(typeof(iris.ping)).to.be.equal('function');
    expect(typeof(iris.createBeneficiaries)).to.be.equal('function');
    expect(typeof(iris.updateBeneficiaries)).to.be.equal('function');
    expect(typeof(iris.getBeneficiaries)).to.be.equal('function');
    expect(typeof(iris.createPayouts)).to.be.equal('function');
    expect(typeof(iris.approvePayouts)).to.be.equal('function');
    expect(typeof(iris.rejectPayouts)).to.be.equal('function');
    expect(typeof(iris.getPayoutDetails)).to.be.equal('function');
    expect(typeof(iris.getTransactionStatements)).to.be.equal('function');
    expect(typeof(iris.getTopupChannels)).to.be.equal('function');
    expect(typeof(iris.getBalance)).to.be.equal('function');
    expect(typeof(iris.getBankAccounts)).to.be.equal('function');
    expect(typeof(iris.getBankAccountBalance)).to.be.equal('function');
    expect(typeof(iris.getBeneficiaryBanks)).to.be.equal('function');
    expect(typeof(iris.getBankAccountBalance)).to.be.equal('function');
    expect(iris.apiConfig.get().serverKey).to.be.a('string');
  })

  it('able to re-set serverKey via setter',()=>{
    let iris = new Iris();
    expect(iris.apiConfig.get().serverKey).to.be.equals('');
    expect(iris.apiConfig.get().isProduction).to.be.false;
    iris.apiConfig.set({serverKey:cons.irisApiKey});
    expect(iris.apiConfig.get().serverKey).to.be.equals(cons.irisApiKey);
    expect(iris.apiConfig.get().isProduction).to.be.false;
  })

  it('able to re-set serverKey via property',()=>{
    let iris = new Iris();
    expect(iris.apiConfig.get().serverKey).to.be.equals('');
    expect(iris.apiConfig.get().isProduction).to.be.false;
    iris.apiConfig.serverKey = cons.irisApiKey;
    expect(iris.apiConfig.get().serverKey).to.be.equals(cons.irisApiKey);
    expect(iris.apiConfig.get().isProduction).to.be.false;
  })

  it('able to ping',()=>{
    let iris = new Iris(generateConfig());
    iris.ping()
      .then((res)=>{
        console.log('theres:',res);
        expect(res).to.be.a('string');
        expect(res).to.be.equals('pong');
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
    serverKey: cons.irisApiKey
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
      "start_time": ((new Date).getFullYear()+1)+"-12-20 18:11:08 +0700",
      "unit": "minutes",
      "duration": 1
    },
    "custom_field1": "custom field 1 content",
    "custom_field2": "custom field 2 content",
    "custom_field3": "custom field 3 content"
  }
}