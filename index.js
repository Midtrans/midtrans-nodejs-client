const Snap = require('./lib/snap');
const CoreApi = require('./lib/coreApi');
const Iris = require('./lib/iris');
const MidtransError = require('./lib/midtransError');
const {SnapBiConfig, SnapBi} = require("./SnapBiClient");
const Midtrans = { 
	Snap, 
	CoreApi, 
	Iris, 
	MidtransError,
}

module.exports = {
	Midtrans,
	SnapBiConfig,
	SnapBi
};