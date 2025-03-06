import { expect } from 'chai';
import { Snap, CoreApi } from '../index.js';
import { serverKey, clientKey } from './sharedConstants.js';

describe('midtrans-client', () => {
  it('able to start test', () => {
    expect(true).to.be.true;
  });

  it('have Snap class', () => {
    expect(typeof Snap).to.be.equal('function');
  });

  it('have CoreApi class', () => {
    expect(typeof CoreApi).to.be.equal('function');
  });

  it('able to create CoreApi instance', () => {
    let core = new CoreApi(generateConfig());
    expect(typeof core).to.be.equal('object');
    expect(core.apiConfig.get().serverKey).to.be.a('string');
    expect(core.apiConfig.get().clientKey).to.be.a('string');
    expect(core.apiConfig.get().isProduction).to.be.a('boolean');
  });

  it('able to create Snap instance', () => {
    let snap = new Snap(generateConfig());
    expect(typeof snap).to.be.equal('object');
    expect(snap.apiConfig.get().serverKey).to.be.a('string');
    expect(snap.apiConfig.get().clientKey).to.be.a('string');
    expect(snap.apiConfig.get().isProduction).to.be.a('boolean');
  });
});

/**
 * Helper function
 */

function generateConfig() {
  return {
    isProduction: false,
    serverKey,
    clientKey,
  };
}
