const makeCrudRouter = require("./makeCrudRouter");
const RentGroup = require("../models/RentGroup");
module.exports = makeCrudRouter(RentGroup);
