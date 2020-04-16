const mongoose = require('mongoose');

const coverImageSchema = new mongoose.Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number
}, { timestamps: true });

const CoverImage = mongoose.model('CoverImage', coverImageSchema);
module.exports = CoverImage;
