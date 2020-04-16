const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
