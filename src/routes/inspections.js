const makeCrudRouter = require("./makeCrudRouter");
const Inspection = require("../models/Inspection");
module.exports = makeCrudRouter(Inspection);
