import { expect } from 'chai';
import { ApiConfig } from '../lib/apiConfig.js';
import {
  serverKey,
  clientKey,
  CORE_SANDBOX_BASE_URL,
  CORE_PRODUCTION_BASE_URL,
  SNAP_SANDBOX_BASE_URL,
  SNAP_PRODUCTION_BASE_URL,
} from './sharedConstants.js';

describe('Config.js', () => {
  it('able to start test', () => {
    expect(true).to.be.true;
  });

  it('able to store config', () => {
    let configObj = new ApiConfig(generateConfig());
    expect(configObj.get().isProduction).to.be.false;
    expect(configObj.get().serverKey).to.be.a('string');
    expect(configObj.get().clientKey).to.be.a('string');
    expect(configObj.get().serverKey).to.be.equal(serverKey);
    expect(configObj.get().clientKey).to.be.equal(clientKey);
  });

  it('able to set config', () => {
    let configObj = new ApiConfig();
    configObj.set(generateConfig());
    expect(configObj.get().isProduction).to.be.false;
    expect(configObj.get().serverKey).to.be.a('string');
    expect(configObj.get().clientKey).to.be.a('string');
    expect(configObj.get().serverKey).to.be.equal(serverKey);
    expect(configObj.get().clientKey).to.be.equal(clientKey);
  });

  it('able to get correct API url environtment for Core Api', () => {
    let configObj = new ApiConfig();
    configObj.set({ isProduction: false });
    expect(configObj.getCoreApiBaseUrl()).to.be.equal(CORE_SANDBOX_BASE_URL);
    configObj.set({ isProduction: true });
    expect(configObj.getCoreApiBaseUrl()).to.be.equal(CORE_PRODUCTION_BASE_URL);
  });

  it('able to get correct API url environtment for Snap', () => {
    let configObj = new ApiConfig();
    configObj.set({ isProduction: false });
    expect(configObj.getSnapApiBaseUrl()).to.be.equal(SNAP_SANDBOX_BASE_URL);
    configObj.set({ isProduction: true });
    expect(configObj.getSnapApiBaseUrl()).to.be.equal(SNAP_PRODUCTION_BASE_URL);
  });
});

function generateConfig() {
  return {
    isProduction: false,
    serverKey,
    clientKey,
  };
}
