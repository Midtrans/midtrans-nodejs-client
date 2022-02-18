'use strict';
// @TODO continue and create thorough test for IRIS

const expect = require('chai').expect;
const midtransClient = require('./../index.js');
const Iris = midtransClient.Iris;
const cons = require('./sharedConstants');
let globVar = {};

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
      "account": "0611101146",
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
        expect(e.ApiResponse.errors[0]).to.includes('already been taken');
      })
  })

  it('able to updateBeneficiaries with existing/created account',()=>{
    let iris = new Iris(generateConfig());
    return iris.updateBeneficiaries('budisusantoo',{
      "name": "Budi Susantoo",
      "account": "0611101141",
      "bank": "bca",
      "alias_name": "budisusantoo",
      "email": "budi.susantoo@example.com"
    })
      .then((res)=>{
        expect(res).to.have.property('status');
        expect(res.status).to.includes('updated');
      })
  })

  it('able to getBeneficiaries',()=>{
    let iris = new Iris(generateConfig());
    return iris.getBeneficiaries()
      .then((res)=>{
        expect(res).to.be.an('array');
        expect(res[0]).to.have.property('alias_name');
        expect(res[0]).to.have.property('account');
      })
  })

  it('able to createPayouts',()=>{
    let iris = new Iris(generateConfig());
    return iris.createPayouts({
      "payouts": [
        {
          "beneficiary_name": "Budi Susantoo",
          "beneficiary_account": "0611101146",
          "beneficiary_bank": "bca",
          "beneficiary_email": "budi.susantoo@example.com",
          "amount": "10233",
          "notes": "unit test node js"
        },
      ]
    })
      .then((res)=>{
        expect(res).to.have.property('payouts');
        expect(res.payouts).to.be.an('array');
        expect(res.payouts[0]).to.have.property('reference_no');
        expect(res.payouts[0].reference_no).to.be.a('string');
        globVar.createdRefNo = res.payouts[0].reference_no;
      })
  })

  it('fail to approvePayouts: role not authorized',()=>{
    let iris = new Iris(generateConfig());
    return iris.approvePayouts({
      "reference_nos": ['123123123'],
      "otp": "335163"
    })
      .then((res)=>{
      })
      .catch((e)=>{
        expect(e.message).to.includes(401);
        expect(e.message).to.includes('not authorized');
      })
  })

  it('fail to rejectPayouts: role not authorized',()=>{
    let iris = new Iris(generateConfig());
    return iris.rejectPayouts({
      "reference_nos": [globVar.createdRefNo],
      "reject_reason": "Reason to reject payouts"
    })
      .then((res)=>{
        // expect(res).to.have.property('status');
        // expect(res.status).to.be.a('string');
      })
      .catch((e)=>{
        expect(e.message).to.includes(401);
        expect(e.message).to.includes('not authorized');
      })
  })

  // @TODO: should add test that success to approve & reject payouts
  // currently it's not implemented because the testing API-key's role is not authorized,
  // should get it to work.

  it('able to getPayoutDetails from above',()=>{
    let iris = new Iris(generateConfig());
    return iris.getPayoutDetails(globVar.createdRefNo)
      .then((res)=>{
        // console.log(res);
        expect(res).to.have.property('status');
        expect(res.status).to.be.a('string');
        expect(res.status).to.equals('queued');
      })
  })

  it('able to getTransactionHistory',()=>{
    let iris = new Iris(generateConfig());
    return iris.getTransactionHistory()
      .then((res)=>{
        expect(res).to.be.an('array');
        if(res.length > 0){
          expect(res[0].status).to.be.a('string');
          expect(res[0].reference_no).to.be.a('string');
          expect(res[0].beneficiary_account).to.be.a('string');
        }
      })
  })

  it('able to getTopupChannels',()=>{
    let iris = new Iris(generateConfig());
    return iris.getTopupChannels()
      .then((res)=>{
        expect(res).to.be.an('array');
        expect(res[0].id).to.be.a('number');
        expect(res[0].virtual_account_type).to.be.a('string');
        expect(res[0].virtual_account_number).to.be.a('string');
      })
  })

  it('able to getBalance',()=>{
    let iris = new Iris(generateConfig());
    return iris.getBalance()
      .then((res)=>{
        expect(res.balance).to.be.a('string');
      })
  })

  it('fail to getFacilitatorBankAccounts: not authorized due to non facilitator account',()=>{
    let iris = new Iris(generateConfig());
    return iris.getFacilitatorBalance()
      .catch((e)=>{
        expect(e.message).to.includes('not authorized');
      })
  })

  it('fail to getFacilitatorBalance: not authorized due to non facilitator account',()=>{
    let iris = new Iris(generateConfig());
    return iris.getFacilitatorBalance()
      .catch((e)=>{
        expect(e.message).to.includes('not authorized');
      })
  })

  it('able to getBeneficiaryBanks',()=>{
    let iris = new Iris(generateConfig());
    return iris.getBeneficiaryBanks()
      .then((res)=>{
        expect(res.beneficiary_banks).to.be.an('array');
        expect(res.beneficiary_banks[0].code).to.be.a('string');
        expect(res.beneficiary_banks[0].name).to.be.a('string');
      })
  })

  it('able to validateBankAccount',()=>{
    let iris = new Iris(generateConfig());
    return iris.validateBankAccount({
      bank:"mandiri",
      account:"1111222233333"
    })
      .then((res)=>{
        expect(res.account_no).to.be.a('string');
        expect(res.account_name).to.be.a('string');
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
