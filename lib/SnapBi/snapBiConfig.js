class SnapBiConfig {
    // Static properties for configuration values
    static isProduction = false;
    static snapBiClientId = null;
    static snapBiPrivateKey = null;
    static snapBiClientSecret = null;
    static snapBiPartnerId = null;
    static snapBiChannelId = null;
    static enableLogging = false;
    static snapBiPublicKey = null;

    // Constants for base URLs
    static SNAP_BI_SANDBOX_BASE_URL = 'https://merchants.sbx.midtrans.com';
    static SNAP_BI_PRODUCTION_BASE_URL = 'https://merchants.midtrans.com';
    static getBaseUrl() {
        return this.isProduction
            ? this.SNAP_BI_PRODUCTION_BASE_URL
            : this.SNAP_BI_SANDBOX_BASE_URL;
    }
}

module.exports = SnapBiConfig;
