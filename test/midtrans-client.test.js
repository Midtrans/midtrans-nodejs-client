'use strict';

const expect = require('chai').expect;
const midtransClient = require('./../index.js');
const cons = require('./sharedConstants');

describe('midtrans-client',()=> {

  it('able to start test',()=>{
    expect(true).to.be.true
  })

  it('have Snap class',()=>{
    expect(typeof(midtransClient.Snap)).to.be.equal('function');
  })

  it('have CoreApi class',()=>{
    expect(typeof(midtransClient.CoreApi)).to.be.equal('function');
  })

  it('able to create CoreApi instance',()=>{
    let core = new midtransClient.CoreApi(generateConfig());
    expect(typeof(core)).to.be.equal('object');
    expect(core.apiConfig.get().serverKey).to.be.a('string');
    expect(core.apiConfig.get().clientKey).to.be.a('string');
    expect(core.apiConfig.get().isProduction).to.be.a('boolean');
  })

  it('able to create Snap instance',()=>{
    let snap = new midtransClient.Snap(generateConfig());
    expect(typeof(snap)).to.be.equal('object');
    expect(snap.apiConfig.get().serverKey).to.be.a('string');
    expect(snap.apiConfig.get().clientKey).to.be.a('string');
    expect(snap.apiConfig.get().isProduction).to.be.a('boolean');
  })

})

/**
 * Helper function
 */

function generateConfig(){
  return {
    isProduction: false,
    serverKey: cons.serverKey,
    clientKey: cons.clientKey
  }
}