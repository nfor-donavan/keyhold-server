const makeCrudRouter = require("./makeCrudRouter");
const Lease = require("../models/Lease");
module.exports = makeCrudRouter(Lease);
