const mongoose = require("mongoose");

mongoose.connect("mongodb://root:root@localhost:27017/admin");


mongoose.Promise = global.Promise;

module.exports = mongoose;
