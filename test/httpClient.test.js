'use strict';

const expect = require('chai').expect;
const HttpClient = require('./../lib/httpClient');
const cons = require('./sharedConstants');

function generateParamMin(){
  return {
    "transaction_details": {
      "order_id": "node-midtransclient-test-"+Math.round((new Date()).getTime() / 1),
      "gross_amount": 200000
    }, "credit_card":{
      "secure" : true
    }
  }
}

describe('httpClient.js',()=> {

  it('able to start test',()=>{
    expect(true).to.be.true
  })

  it('class should be working',()=>{
    let httpClient = new HttpClient();
    expect(httpClient instanceof HttpClient).to.be.true;
  })
  
  it('have .request function',()=>{
    let httpClient = new HttpClient();
    expect(typeof(httpClient.request)).to.be.equal('function')
  })
  
  it('able to raw request to snap api',()=>{
    let httpClient = new HttpClient();
    return httpClient.request('post',cons.serverKey,cons.SNAP_SANDBOX_BASE_URL+'/transactions',generateParamMin())
    .then((res)=>{
      expect(res).to.have.property('token');
      expect(res.token).to.be.a('string');
    })
    .catch((e)=>{
      throw e;
    })
  })
  
  it('able to raw request GET Token to Core Api',()=>{
    let httpClient = new HttpClient();
    return httpClient.request(
      'get',
      cons.serverKey,cons.CORE_SANDBOX_BASE_URL+'/v2/token',
      {
        'card_number': '5264 2210 3887 4659',
        'card_exp_month': '12',
        'card_exp_year': ((new Date).getFullYear()+1)+'',
        'card_cvv': '123',
        'client_key': cons.clientKey,
      }
    )
    .then((res)=>{
      expect(res).to.have.property('token_id');
      expect(res.token_id).to.be.a('string');
    })
    .catch((e)=>{
      throw e;
    })
  })
  
  it('able to throw fail to parse string as json exception',()=>{
    let httpClient = new HttpClient();
    return httpClient.request('post',cons.serverKey,cons.SNAP_SANDBOX_BASE_URL+'/transactions','not json')
    .then((res)=>{})
    .catch((e)=>{
      expect(e.message).to.includes('fail to parse');
    })
  })

  // comment out flaky test
  // it('able to throw connection failure exception',()=>{
  //   let httpClient = new HttpClient();
  //   httpClient.http_client.defaults.timeout = 2; // override/set axios timeout param
  //   // didn't work dummy domain won't trigger timeout case
  //   return httpClient.request('post',cons.serverKey,'https://non-exist-unreachable-domain-name.com:4321',generateParamMin())
  //   .then((res)=>{})
  //   .catch((e)=>{
  //     expect(e.message).to.includes('connection failure');
  //   })
  // })

})