const Snap = require('./lib/snap');
const CoreApi = require('./lib/coreApi');
const Iris = require('./lib/iris');
const MidtransError = require('./lib/midtransError');
const Midtrans = { 
	Snap, 
	CoreApi, 
	Iris, 
	MidtransError 
}

module.exports = Midtrans;