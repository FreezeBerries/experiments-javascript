const mongoose = require('mongoose');
const Company = require('../models/app/Company');
const signupcode = require('../config/signupcode');

exports.getCompany = (req, res) => {
  Company.findOneOrCreate((err, companyInfo) => {
    if(!companyInfo.signupcode || companyInfo.signupcode === "") {
      companyInfo.signupcode = signupcode.code;
    }

    res.render('admin/app/company', {
      title: 'Company',
      sidebar: 'app-company',
      companyInfo: companyInfo
    });
  });
};

exports.apiPostCompany = (req, res) => {
  Company.findOneOrCreate((err, companyInfo) => {
    Company.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(companyInfo.id)
      },
      {
        $set: req.body
      },
      {new: true},
      (err, doc) => {
        if (err) {
          res.json({success: false});
        } else {
          res.json({success: true});
        }
      }
    );
  });
};

exports.getUser = (req, res) => {
  res.render('admin/app/user', {
    title: 'User'
  });
};

exports.getUsers = (req, res) => {
  res.render('admin/app/users', {
    title: 'Users'
  });
};
