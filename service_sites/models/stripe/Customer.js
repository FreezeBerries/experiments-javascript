const mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
  stripe: Object,
  card: Object,
  subscription: Object
});


const customer = mongoose.model('Customer', customerSchema);
module.exports = customer;
