const Snap = require('./lib/snap');
const CoreApi = require('./lib/coreApi');
const MidtransError = require('./lib/midtransError');
const Midtrans = { Snap, CoreApi, MidtransError }

module.exports = Midtrans;