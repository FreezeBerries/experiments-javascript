const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Testimonials = require('../models/site/Testimonials');
const Services = require('../models/site/Services');
const Gallery = require('../models/site/Gallery');
const CoverImages = require('../models/site/CoverImages');
const Project = require('../models/site/Project');
const ProjectBeforeImage = require('../models/site/Project_Before_Image');
const ProjectAfterImage = require('../models/site/Project_After_Image');

exports.getProject = (req, res) => {
  Project.findOne({ _id: mongoose.Types.ObjectId(req.query.id) }, (err, result) => {
    console.log('err', err);
    console.log('result', result);
    res.render('admin/site/project', {
      title: result.name + ' Project',
      sidebar: 'site-beforeandafter',
      project: result
    });
  });
};

exports.postProjectBeforeImage = (req, res) => {
  console.log('before Images', Object.assign({projectId: req.body.id}, req.file));
  // Saving file upload information
  if(req.file) {
    var projectBeforeImage = new ProjectBeforeImage(Object.assign({projectId: req.body.id}, req.file));
    projectBeforeImage.save();
  }
  res.redirect('/admin/site/project?id=' + req.body.id);
}

exports.postProjectAfterImage = (req, res) => {
  console.log('after Images', Object.assign({projectId: req.body.id}, req.file));
  if(req.file) {
    // Saving file upload information
    var projectAfterImage = new ProjectAfterImage(Object.assign({projectId: req.body.id}, req.file));
    projectAfterImage.save();
  }
  res.redirect('/admin/site/project?id=' + req.body.id);
}

exports.apiGetProjectBeforeImages = (req, res) => {
  ProjectBeforeImage.find({ projectId: mongoose.Types.ObjectId(req.query.id) }).select('_id filename').exec(function(err, result){
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiGetProjectAfterImages = (req, res) => {
  ProjectAfterImage.find({ projectId: mongoose.Types.ObjectId(req.query.id) }).select('_id filename').exec(function(err, result){
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiDeleteProject = (req, res) => {
  ProjectBeforeImage.find({projectId: mongoose.Types.ObjectId(req.body.id)}).remove().exec();
  ProjectAfterImage.find({projectId: mongoose.Types.ObjectId(req.body.id)}).remove().exec();
  Project.find({_id: mongoose.Types.ObjectId(req.body.id)}).remove().exec();
  res.json({success: true});
}

exports.apiDeleteProjectBeforeImage = (req, res) => {
  ProjectBeforeImage.findOne({ _id: mongoose.Types.ObjectId(req.body.id) }).select('_id filename').exec(function(err, result){
    console.log('result', result);
    try {
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', result.filename));
      ProjectBeforeImage.find({ _id:mongoose.Types.ObjectId(req.body.id) }).remove().exec();
    } catch(err) {
      console.error(err);
      res.json({success: false});
    }
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiDeleteProjectAfterImage = (req, res) => {
  ProjectAfterImage.findOne({ _id: mongoose.Types.ObjectId(req.body.id) }).select('_id filename').exec(function(err, result){
    try {
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', result.filename));
      ProjectAfterImage.find({ _id:mongoose.Types.ObjectId(req.body.id) }).remove().exec();
    } catch(err) {
      console.error(err);
      res.json({success: false});
    }
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiPostProject = (req, res) => {
  var project = req.body;
  if (project.id) {
    Project.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(project.id)
      },
      {
        $set: {
          name: project.name,
          description: project.description
        }
      },
      {new: true},
      (err, doc) => {
        console.log(err);
      }
    );

    res.json({success: true });
  } else {
    var project = new Project({
      name: project.name,
      description: project.description
    });

    project.save();
    res.json({success: true, data: project });
  }
}


exports.getProjects = (req, res) => {
  Project.find({}, (err, projects) => {
    res.render('admin/site/projects', {
      title: 'Projects',
      sidebar: 'site-projects',
      projects: projects
    });
  });
};



exports.getCoverImages = (req, res) => {
  res.render('admin/site/cover_images', {
    title: 'Cover Images',
    sidebar: 'site-coverimages'
  });
};

exports.postCoverImage = (req, res) => {
  // Saving file upload information
  if(req.file) {
    var coverImage = new CoverImages(req.file);
    coverImage.save();
  }
  // api this in the future
  // res.json({success: true});
  res.redirect('/admin/site/cover_images');
}

exports.apiGetCoverImage = (req, res) => {
  CoverImages.find({}).select('_id filename').exec(function(err, result){
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiDeleteCoverImage = (req, res) => {
  CoverImages.findOne({ _id: mongoose.Types.ObjectId(req.body.id) }).select('_id filename').exec(function(err, result){
    try {
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', result.filename));
      CoverImages.find({ _id:mongoose.Types.ObjectId(req.body.id) }).remove().exec();
    } catch(err) {
      console.error(err);
      res.json({success: false});
    }
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });


}

exports.getGallery = (req, res) => {
  res.render('admin/site/gallery', {
    title: 'Gallery',
    sidebar: 'site-gallery'
  });
};

exports.postGallery = (req, res) => {
  // Saving file upload information
  if(req.file) {
    var gallery = new Gallery(req.file);
    gallery.save();
  }
  // api this in the future
  // res.json({success: true});
  res.redirect('/admin/site/gallery');
}

exports.apiGetGallery = (req, res) => {
  Gallery.find({}).select('_id filename').exec(function(err, result){
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiDeleteGallery = (req, res) => {
  Gallery.findOne({ _id: mongoose.Types.ObjectId(req.body.id) }).select('_id filename').exec(function(err, result){
    try {
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', result.filename));
      Gallery.find({ _id:mongoose.Types.ObjectId(req.body.id) }).remove().exec();
    } catch(err) {
      console.error(err);
      res.json({success: false});
    }
    if(!err) {
      res.json({success: true, data: result});
    } else {
      res.json({success: false});
    }
  });


}


exports.getServices = (req, res) => {
  res.render('admin/site/services', {
    title: 'Services',
    sidebar: 'site-services'
  });
};

exports.apiDeleteService = (req, res) => {
  Services.find({ _id:mongoose.Types.ObjectId(req.body.id) }).remove().exec();
  res.json({success: true});
}

exports.apiGetServices = (req, res) => {
  Services.find(function(err, result){
    if(!err) {
      res.json({success:true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiPostServices = (req, res) => {
  var services = req.body.list;
  for (var i = 0; i < services.length; i++) {
    if (services[i].id) {
      Services.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(services[i].id)
        },
        {
          $set: {
            name: services[i].name,
            message: services[i].message
          }
        },
        {new: true},
        (err, doc) => {
          console.log(err);
        }
      );
    } else {
      var service = new Services({
        name: services[i].name,
        message: services[i].message
      });

      service.save();
    }
  }
  res.json({success: true});
}

exports.getTestimonials = (req, res) => {
  res.render('admin/site/testimonials', {
    title: 'Testimonials',
    sidebar: 'site-testimonials'
  });
};

exports.apiDeleteTestimony = (req, res) => {
  Testimonials.find({ _id:mongoose.Types.ObjectId(req.body.id) }).remove().exec();
  res.json({success: true});
}

exports.apiGetTestimonials = (req, res) => {
  Testimonials.find(function(err, result){
    if(!err) {
      res.json({success:true, data: result});
    } else {
      res.json({success: false});
    }
  });
}

exports.apiPostTestimonials = (req, res) => {
  var testimonials = req.body.list;
  for (var i = 0; i < testimonials.length; i++) {
    if (testimonials[i].id) {
      Testimonials.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(testimonials[i].id)
        },
        {
          $set: {
            name: testimonials[i].name,
            testimony: testimonials[i].testimony
          }
        },
        {new: true},
        (err, doc) => {
          console.log(err);
        }
      );
    } else {
      var testimony = new Testimonials({
        name: testimonials[i].name,
        testimony: testimonials[i].testimony
      });

      testimony.save();
    }
  }
  res.json({success: true});
}
