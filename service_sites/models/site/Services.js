const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  message: String
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
