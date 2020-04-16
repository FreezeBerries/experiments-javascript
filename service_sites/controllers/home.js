const promise = require('lie');
const Company = require('../models/app/Company');
const Services = require('../models/site/Services');
const Gallery = require('../models/site/Gallery');
const Project = require('../models/site/Project');
const Project_After_Image = require('../models/site/Project_After_Image');
const Project_Before_Image = require('../models/site/Project_Before_Image');
const CoverImages = require('../models/site/CoverImages');
const Testimonials = require('../models/site/Testimonials');


var getCompany = () => {
  return new Promise((resolve, reject) => {
    Company.findOneOrCreate((err, companyResult) => {
      if (!companyResult.name || companyResult.name === "") {
        companyResult.name = "Company Name";
      }

      if (!companyResult.phone || companyResult.phone === "") {
        companyResult.phone = "(555) 555-5555";
      }

      if (!companyResult.email || companyResult.email === "") {
        companyResult.email = "test@companyname.com";
      }

      if (!companyResult.facebook_link || companyResult.facebook_link === "") {
        companyResult.facebook_link = undefined;
      }

      if (!companyResult.yelp_link || companyResult.yelp_link === "") {
        companyResult.yelp_link = undefined;
      }

      if (!companyResult.angies_list_link || companyResult.angies_list_link === "") {
        companyResult.angies_list_link = undefined;
      }

      if (!companyResult.youtube_link || companyResult.youtube_link === "") {
        companyResult.youtube_link = undefined;
      }

      if (!companyResult.twitter_link || companyResult.twitter_link === "") {
        companyResult.twitter_link = undefined;
      }
      resolve(companyResult);
    });
  });
}

exports.getActivation = (req, res) => {
  res.render('account/activation', {
    title: 'Activation'
  })
}

exports.getProjectById = (req, res) => {
  getCompany().then((companyResult) => {
    Project.findOne({_id: req.params.id}).exec((err, projectResult) => {
      console.log('hit', projectResult);
      res.render('site/original/project', {
        title: 'Home',
        sidebar: 'site-project',
        company: companyResult,
        project: projectResult
      });
    });
  });
}

exports.getLandingPage = (req, res) => {
  getCompany().then((companyResult) => {
    CoverImages.find((err, coverImagesResult) => {
      Gallery.find({}).limit(3).exec((err, galleryResult) => {
        Services.find({}).limit(3).exec((err, serviceResult) => {
          Project.find({}).limit(3).exec((err, projectsResult) => {
            Testimonials.find((err, testimonialsResult)=> {
              res.render('site/original/home', {
                title: 'Home',
                sidebar: 'home',
                company: companyResult,
                coverImages: coverImagesResult,
                gallery: galleryResult,
                services: serviceResult,
                projects: projectsResult,
                testimonials: testimonialsResult
              });
            });
          });
        });
      });
    });
  });
};

exports.getGallery = (req, res) => {
  getCompany().then((companyResult) => {
    Gallery.find({}).select('filename').exec((err, galleryResult) => {
      res.render('site/original/gallery', {
        title: 'Gallery',
        sidebar: 'gallery',
        company: companyResult,
        gallery: galleryResult
      });
    });
  });
};

exports.getProjects = (req, res) => {
  getCompany().then((companyResult) => {
    Project.find({}, (err, projectsResult) => {
      res.render('site/original/projects', {
        title: 'Projects',
        sidebar: 'projects',
        company: companyResult,
        projects: projectsResult
      });
    });
  });
};

exports.apiGetBeforeImages = (req, res) => {
  Project_Before_Image.find({projectId: req.query.id}).select('filename').exec((err, result) => {
    res.json({success: true, data: result});
  });
}

exports.apiGetPreviewImage = (req, res) => {
  Project_After_Image.findOne({projectId: req.query.id}).select('filename').exec((err, result) => {
    res.json({success: true, data: result});
  });
}

exports.apiGetAfterImages = (req, res) => {
  Project_After_Image.find({projectId: req.query.id}).select('filename').exec((err, result) => {
    res.json({success: true, data: result});
  });
}
exports.getServices = (req, res) => {
  getCompany().then((companyResult) => {
    Services.find({}).select('name message').exec((err, serviceResult) => {
      res.render('site/original/services', {
        title: 'Services',
        sidebar: 'services',
        company: companyResult,
        services: serviceResult
      });
    });
  });
};

//// OLD HOME SAVED
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};
