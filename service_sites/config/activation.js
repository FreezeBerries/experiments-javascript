const Customer = require('../models/stripe/Customer');
const demomode = process.env.DEMOMODE === "true";

exports.isActive = false;

exports.isActiveAccount = (req, res, next) => {
  if (demomode || module.exports.isActive) {
    next();
    return;
  }

  Customer.findOne({}, (err, customer) => {
    if (!customer || !customer.subscription) {
      res.redirect('/activation')
    } else {
      module.exports.isActive = true;
      next();
    }
  });
}
