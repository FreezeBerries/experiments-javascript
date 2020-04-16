const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  signupcode: String,
  name: String,
  email: String,
  phone: String,
  open_since_year: Number,
  about: String,
  facebook_link: String,
  yelp_link: String,
  angies_list_link: String,
  youtube_link: String,
  twitter_link: String
}, { timestamps: true });

companySchema.statics.findOneOrCreate = function findOneOrCreate( callback) {
  const self = this;
  self.findOne({}, (err, result) => {
    return result
      ? callback(err, result)
      : self.create({}, (err, result) => {
        return callback(err, result);
      });
  });
};
//
// companySchema.statics.findOneOrCreate = function(callback) {
//     const self = this
//     self.findOne((err, result) => {
//         return result ? callback(err, result) : self.create((err, result) => {
//           console.log('blah test');
//           return callback(err, result)
//          })
//     })
// }

const Company = mongoose.model('company', companySchema);
module.exports = Company;
