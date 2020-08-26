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
    expect(typeof(iris.getTransactionHistory)).to.be.equal('function');
    expect(typeof(iris.getTopupChannels)).to.be.equal('function');
    expect(typeof(iris.getBalance)).to.be.equal('function');
    expect(typeof(iris.getFacilitatorBankAccounts)).to.be.equal('function');
    expect(typeof(iris.getFacilitatorBalance)).to.be.equal('function');
    expect(typeof(iris.getBeneficiaryBanks)).to.be.equal('function');
    expect(typeof(iris.validateBankAccount)).to.be.equal('function');
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

  it('able to ping with correct api key',()=>{
    let iris = new Iris(generateConfig());
    return iris.ping()
      .then((res)=>{
        expect(res).to.be.a('string');
        expect(res).to.be.equals('pong');
      })
  })

  it('fail 401 to createBeneficiaries with unset api key',()=>{
    let iris = new Iris();
    return iris.createBeneficiaries({})
      .then((res)=>{
        expect(res).to.equals(null);
      })
      .catch((e)=>{
        // console.log(e);
        expect(e.httpStatusCode).to.equals(401);
        expect(e.message).to.includes('denied');
      })
  })

  it('fail to createBeneficiaries: account duplicated / already been taken',()=>{
    let iris = new Iris(generateConfig());
    return iris.createBeneficiaries({
      "name": "Budi Susantoo",
      "account": "123321124",
      "bank": "bca",
      "alias_name": "budisusantoo",
      "email": "budi.susantoo@example.com"
    })
      .then((res)=>{
        expect(res).to.equals(null);
      })
      .catch((e)=>{
        expect(e.httpStatusCode).to.equals(400);
        expect(e.message).to.includes('400');
        expect(e.message).to.includes('error occurred when creating beneficiary');
        expect(e.ApiResponse.errors).to.includes('Account has already been taken');
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

// TODO: replace these dummy funcs below

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