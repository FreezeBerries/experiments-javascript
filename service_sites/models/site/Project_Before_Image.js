const mongoose = require('mongoose');

const projectBeforeImageSchema = new mongoose.Schema({
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

const ProjectBeforeImage = mongoose.model('Project_Before_Image', projectBeforeImageSchema);
module.exports = ProjectBeforeImage;
