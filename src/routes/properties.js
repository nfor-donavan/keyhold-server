const makeCrudRouter = require("./makeCrudRouter");
const Property = require("../models/Property");
module.exports = makeCrudRouter(Property);
