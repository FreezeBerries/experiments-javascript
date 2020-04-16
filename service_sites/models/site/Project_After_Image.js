const mongoose = require('mongoose');

const projectAfterImageSchema = new mongoose.Schema({
  projectId: {type: mongoose.Types.ObjectId, ref: 'Project'},
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number
}, { timestamps: true });

const ProjectAfterImage = mongoose.model('Project_After_Image', projectAfterImageSchema);
module.exports = ProjectAfterImage;
