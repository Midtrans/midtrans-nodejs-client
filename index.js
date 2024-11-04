const Snap = require('./lib/snap');
const CoreApi = require('./lib/coreApi');
const Iris = require('./lib/iris');
const MidtransError = require('./lib/midtransError');
const SnapBiConfig = require('./lib/snapBi/snapBiConfig');
const SnapBi = require('./lib/snapBi/snapBi');
const Midtrans = {
	Snap,
	CoreApi,
	Iris,
	MidtransError,
	SnapBiConfig,
	SnapBi
};
module.exports = Midtrans;