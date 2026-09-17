const makeCrudRouter = require("./makeCrudRouter");
const Maintenance = require("../models/Maintenance");
module.exports = makeCrudRouter(Maintenance);
