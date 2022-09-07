const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/backend');

mongoose.Promise = global.Promise;

module.exports = mongoose;
