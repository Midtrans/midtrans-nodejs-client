'use strict';

const expect = require('chai').expect;
const ApiConfig = require('./../lib/apiConfig');
const cons = require('./sharedConstants');

describe('Config.js',()=> {

  it('able to start test',()=>{
    expect(true).to.be.true
  })

  it('able to store config',()=>{
    let configObj = new ApiConfig(generateConfig());
    expect(configObj.get().isProduction).to.be.false;
    expect(configObj.get().serverKey).to.be.a('string');
    expect(configObj.get().clientKey).to.be.a('string');
    expect(configObj.get().serverKey).to.be.equal(cons.serverKey);
    expect(configObj.get().clientKey).to.be.equal(cons.clientKey);
  });

  it('able to set config',()=>{
    let configObj = new ApiConfig();
    configObj.set(generateConfig());
    expect(configObj.get().isProduction).to.be.false;
    expect(configObj.get().serverKey).to.be.a('string');
    expect(configObj.get().clientKey).to.be.a('string');
    expect(configObj.get().serverKey).to.be.equal(cons.serverKey);
    expect(configObj.get().clientKey).to.be.equal(cons.clientKey);
  });

  it('able to get correct API url environtment for Core Api',()=>{
    let configObj = new ApiConfig();
    configObj.set({isProduction: false});
    expect(configObj.getCoreApiBaseUrl()).to.be.equal(cons.CORE_SANDBOX_BASE_URL);
    configObj.set({isProduction: true});
    expect(configObj.getCoreApiBaseUrl()).to.be.equal(cons.CORE_PRODUCTION_BASE_URL);
  });

  it('able to get correct API url environtment for Snap',()=>{
    let configObj = new ApiConfig();
    configObj.set({isProduction: false});
    expect(configObj.getSnapApiBaseUrl()).to.be.equal(cons.SNAP_SANDBOX_BASE_URL);
    configObj.set({isProduction: true});
    expect(configObj.getSnapApiBaseUrl()).to.be.equal(cons.SNAP_PRODUCTION_BASE_URL);
  });
})



function generateConfig(){
  return {
    isProduction: false,
    serverKey: cons.serverKey,
    clientKey: cons.clientKey
  }
}